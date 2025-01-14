﻿using MeetApp.Database;
using MeetApp.Database.Models;
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
    [Route("/api/v1/user")]
    [Route("/api/v1/users")]
    public class UserController(
        IConfiguration configuration,
        UserManager<User> userManager
    ) : ControllerBase
    {
        private readonly IConfiguration configuration = configuration;
        private readonly UserManager<User> userManager = userManager;

        [HttpGet]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<Guid>>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAsync(CancellationToken cancellationToken = default)
        {
            if (!this.ModelState.IsValid)
            {
                return BadRequest();
            }
            var userIds = await userManager.Users
                .Select(x => x.Id)
                .ToListAsync(cancellationToken);
            return Ok(userIds);
        }

        [AllowAnonymous]
        [HttpGet("bussines-type")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<string>>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetBussinesTypeAsync(CancellationToken cancellationToken = default)
        {
            await Task.CompletedTask;
            if (!this.ModelState.IsValid)
            {
                return BadRequest();
            }
            return Ok(Enum.GetNames<User.BussinesCategoryType>());
        }

        [AllowAnonymous]
        [Consumes(MediaTypeNames.Application.Json)]
        [HttpPost("registration")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<RegistrationRequest>(StatusCodes.Status200OK)]
        [ProducesResponseType<RegistrationRequest>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegistrationAsync([FromBody][Required] RegistrationRequest registrationRequest, CancellationToken cancellationToken = default)
        {
            var user = new User
            {
                BussinesAddress = registrationRequest.BussinesAddress,
                BussinesCategory = registrationRequest.BussinesCategory,
                BussinesName = registrationRequest.BussinesName,
                CIF = registrationRequest.CIF,
                City = registrationRequest.City,
                Email = registrationRequest.Email,
                GoogleMapsUrl = registrationRequest.GoogleMapsUrl,
                Name = registrationRequest.Name,
                ProfilePicture = registrationRequest.ProfilePicture,
                RegisterDateTime = DateTimeOffset.UtcNow,
                Type = registrationRequest.UserType,
                UserName = registrationRequest.Email,
            };
            if (user.Type == Database.Models.User.UserType.Undefined) { return this.BadRequest(); }
            var identityResult = await this.userManager.CreateAsync(user, registrationRequest.Password);
            if (identityResult.Succeeded) { return this.Ok(); }
            return this.BadRequest();
        }


        [AllowAnonymous]
        [HttpPut("businessUpdate/{id}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateBusinessUser([FromBody][Required] BusinessUserUpdateRequest userUpdateRequest, [FromRoute] Guid id, CancellationToken cancellationToken = default)
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user is null)
            {
                return NotFound();
            }
            user.BussinesName = userUpdateRequest.BusinessName;
            user.Email = userUpdateRequest.Email;
            user.City = userUpdateRequest.City;
            user.ProfilePicture = userUpdateRequest.ProfilePicture;
            user.CIF = userUpdateRequest.CIF;
            user.BussinesAddress = userUpdateRequest.BusinessAddress;
            user.GoogleMapsUrl = userUpdateRequest.GoogleMapsUrl;
            user.Longitude = userUpdateRequest.Longitude;
            user.Latitude = userUpdateRequest.Latitude;
            _ = await userManager.UpdateAsync(user);
            return Ok(user);
        }
        public record BusinessUserUpdateRequest
        {
            public required string BusinessName { get; init; }
            public required string Email { get; init; }
            public required string City { get; init; }
            public required string ProfilePicture { get; init; }
            public required string CIF { get; init; }
            public required string BusinessAddress { get; init; }
            public required string GoogleMapsUrl { get; init; }
            public required decimal Longitude { get; init; }
            public required decimal Latitude { get; init; }
        }

        [AllowAnonymous]
        [HttpGet("businesses")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<BusinessInfoResponse>>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllBusinesses(CancellationToken cancellationToken = default)
        {
            var result = await userManager.Users
                 .Include(user => user.Offers)
                  .Where(user => user.Offers.Any(offer => offer.Paid))
                .Select(user => new BusinessInfoResponse
                {
                    BusinessId = user.Id,
                    BusinessName = user.BussinesName,
                    ProfilePicture = user.ProfilePicture,
                    BusinessAddress = user.BussinesAddress,
                    Latitude = user.Latitude,
                    Longitude = user.Longitude,
                })
                .ToListAsync(cancellationToken);
            return Ok(result);
        }

        public record BusinessInfoResponse
        {
            public required Guid BusinessId { get; init; }
            public required string? BusinessName { get; init; }
            public required string? ProfilePicture { get; init; }
            public required string? BusinessAddress { get; init; }
            public required decimal? Latitude { get; init; }
            public required decimal? Longitude { get; init; }
        }

        [AllowAnonymous]
        [HttpPut("userUpdate/{id}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateUser([FromBody][Required] UserUpdateRequest userUpdateRequest, [FromRoute] Guid id, CancellationToken cancellationToken = default)
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user is null)
            {
                return NotFound();
            }
            user.Name = userUpdateRequest.Name;
            user.Email = userUpdateRequest.Email;
            user.City = userUpdateRequest.City;
            user.ProfilePicture = userUpdateRequest.ProfilePicture;
            _ = await userManager.UpdateAsync(user);
            return Ok(user);
        }
        public record UserUpdateRequest
        {
            public required string Email { get; set; }
            public required string City { get; set; }
            public required string ProfilePicture { get; set; }
            public required string Name { get; set; }
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
                User = await this.GetAsync(user.Id, cancellationToken),
            });
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<Guid>>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<UserResponse> GetAsync([FromRoute] Guid id, CancellationToken cancellationToken = default)
        {
            if (!ModelState.IsValid)
            {
                throw new NotImplementedException();
            }
            var userId = id.ToString();
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new NotImplementedException();
            }
            return new UserResponse
            {
                Email = user.Email,
                Id = user.Id,
                Name = user.Name,
                UserType = user.Type,
                BussinesAddress = user.BussinesAddress,
                BussinesCategory = user.BussinesCategory,
                BussinesName = user.BussinesName,
                CIF = user.CIF,
                City = user.City,
                GoogleMapsUrl = user.GoogleMapsUrl,
                ProfilePicture = user.ProfilePicture,
                Latitude = user.Latitude,
                Longitude = user.Longitude,
            };
        }


        public record RegistrationRequest
        {
            public required string Email { get; init; }
            public required string? Name { get; init; }
            public required string Password { get; init; }
            public required User.UserType UserType { get; init; }
            public required string City { get; init; }
            public required string ProfilePicture { get; set; }

            /* BUSSINES FIELDS */
            public string? BussinesName { get; set; }
            public string? BussinesAddress { get; set; }
            public User.BussinesCategoryType BussinesCategory { get; set; }
            public string? CIF { get; set; }
            public string? GoogleMapsUrl { get; set; }
            public decimal? Longitude { get; set; }
            public decimal? Latitude { get; set; }
            /* BUSSINES FIELDS */
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

            public required UserResponse User { get; init; }

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

            public required string? Name { get; init; }

            public required User.UserType UserType { get; init; }
            public required string City { get; init; }
            public required string ProfilePicture { get; set; }

            /* BUSSINES FIELDS */
            public string? BussinesName { get; set; }
            public string? BussinesAddress { get; set; }
            public User.BussinesCategoryType? BussinesCategory { get; set; }
            public string? CIF { get; set; }
            public string? GoogleMapsUrl { get; set; }
            public decimal? Longitude { get; set; }
            public decimal? Latitude { get; set; }
            /* BUSSINES FIELDS */

        }

    }

}
