﻿using MeetApp.Database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace MeetApp.Backend.Controllers.Api.V1
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [ApiExplorerSettings(GroupName = "v1")]
    [Route("/api/v1/users")]
    public class UsersController : ControllerBase
    {

        private readonly IConfiguration configuration;
        private readonly UserManager<User> userManager;

        public UsersController(
            IConfiguration configuration,
            UserManager<User> userManager
        )
        {
            this.configuration = configuration;
            this.userManager = userManager;
        }

        [HttpGet]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<Guid>>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAsync(CancellationToken cancellationToken = default)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var userIds = await userManager.Users
                .Select(x => x.Id)
                .ToListAsync(cancellationToken);
            return Ok(userIds);
        }


        [HttpGet("{id}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<UserResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAsync([FromRoute][Required] Guid id, CancellationToken cancellationToken = default)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var userId = id.ToString();
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new UserResponse
            {
                Email = user.Email,
                Id = user.Id,
            });
        }

        [AllowAnonymous]
        [Consumes(MediaTypeNames.Application.FormUrlEncoded)]
        [HttpPost("token")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<TokenResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<TokenResponseError>(StatusCodes.Status400BadRequest)]
        [ProducesResponseType<TokenResponseError>(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> TokenAsync([FromForm][Required] TokenRequest tokenRequest, CancellationToken cancellationToken = default)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new TokenResponseError
                {
                    Error = "invalid_request",
                });
            }
            if (tokenRequest.GrantType != "password")
            {
                return BadRequest(new TokenResponseError
                {
                    Error = "invalid_grant"
                });
            }
            var user = await userManager.FindByEmailAsync(tokenRequest.Username);
            if (user == null)
            {
                return Unauthorized(new TokenResponseError
                {
                    Error = "invalid_client"
                });
            }
            var validPassword = await userManager.CheckPasswordAsync(user, tokenRequest.Password);
            if (!validPassword)
            {
                return Unauthorized(new TokenResponseError
                {
                    Error = "invalid_client"
                });
            }
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Sid, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
            };
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtBearer:Secret"]));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);
            var jwtSecurityToken = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                signingCredentials: signingCredentials
            );
            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            return Ok(new TokenResponse
            {
                AccessToken = jwtSecurityTokenHandler.WriteToken(jwtSecurityToken),
                TokenType = "Bearer",
            });
        }

        public record TokenRequest
        {

            [FromForm(Name = "client_id")]
            public string? ClientId { get; init; }

            [FromForm(Name = "client_secret")]
            public string? ClientSecret { get; init; }

            [FromForm(Name = "grant_type")]
            [Required]
            public required string GrantType { get; init; }

            [FromForm(Name = "password")]
            [Required]
            public required string Password { get; init; }

            [FromForm(Name = "scope")]
            public string? Scope { get; init; }

            [FromForm(Name = "username")]
            [Required]
            public required string Username { get; init; }

        }

        public record TokenResponse
        {

            [JsonPropertyName("access_token")]
            [Required]
            public required string AccessToken { get; init; }

            [JsonPropertyName("expires_in")]
            public uint? ExpiresIn { get; set; }

            [JsonPropertyName("refresh_token")]
            public string? RefreshToken { get; init; }

            [JsonPropertyName("scope")]
            public string? Scope { get; init; }

            [JsonPropertyName("token_type")]
            [Required]
            public required string TokenType { get; init; }

        }

        public record TokenResponseError
        {

            [JsonPropertyName("error")]
            [Required]
            public required string Error { get; init; }

            [JsonPropertyName("error_description")]
            public string? ErrorDescription { get; init; }

            [JsonPropertyName("error_uri")]
            public string? ErrorUri { get; init; }

        }

        public record UserResponse
        {

            [Required]
            public required string Email { get; init; }

            [Required]
            public required Guid Id { get; init; }

        }

    }

}
