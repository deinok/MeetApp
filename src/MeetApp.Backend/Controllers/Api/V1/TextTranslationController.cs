﻿using Azure.AI.Translation.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;

namespace MeetApp.Backend.Controllers.Api.V1
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [ApiExplorerSettings(GroupName = "v1")]
    [Route("/api/v1/text-translation")]
    public class TextTranslationController(
        TextTranslationClient textTranslationClient
    ) : ControllerBase
    {

        private readonly TextTranslationClient textTranslationClient = textTranslationClient;

        [AllowAnonymous]
        [HttpPost]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<TextTranslationResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<TextTranslationResponse>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PostAsync([FromBody] TextTranslationRequest textTranslationRequest, CancellationToken cancellationToken = default)
        {
            var response = await this.textTranslationClient.TranslateAsync(textTranslationRequest.TargetLanguage, textTranslationRequest.Text, cancellationToken: cancellationToken);
            return this.Ok(new TextTranslationResponse
            {
                Text = response.Value[0].Translations[0].Text,
            });
        }

        public record TextTranslationRequest
        {

            [Required]
            public required string TargetLanguage { get; init; }

            [Required]
            public required string Text { get; init; }

        }

        public record TextTranslationResponse
        {

            [Required]
            public required string Text { get; init; }

        }

    }

}
