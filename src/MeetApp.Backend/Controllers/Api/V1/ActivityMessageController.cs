using MeetApp.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;

namespace MeetApp.Backend.Controllers.Api.V1
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [ApiExplorerSettings(GroupName = "v1")]
    [Route("/api/v1/activity-message")]
    public class ActivityMessageController(
        AppDbContext appDbContext
    ) : ControllerBase
    {

        private readonly AppDbContext appDbContext = appDbContext;

        [AllowAnonymous]
        [HttpGet]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<ActivityMessageReadResponse>>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ReadAsync(CancellationToken cancellationToken = default)
        {
            var result = await this.Read()
                .ToListAsync(cancellationToken);
            return this.Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<ActivityMessageReadResponse>>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ReadAsync([FromRoute] Guid id, CancellationToken cancellationToken = default)
        {
            var result = await this.Read()
                .Where(x => x.Id == id)
                .ToListAsync(cancellationToken);
            return this.Ok(result);
        }

        private IQueryable<ActivityMessageReadResponse> Read()
        {
            return this.appDbContext.ActivityMessages
                .Select(x => new ActivityMessageReadResponse
                {
                    ActivityId = x.Activity.Id,
                    Id = x.Id,
                    Message = x.Message,
                    Timestamp = x.Timestamp,
                    UserId = x.UserId,
                });
        }

        public record ActivityMessageReadResponse
        {
            public required Guid ActivityId { get; init; }
            public required Guid Id { get; init; }
            public required string Message { get; init; }
            public required DateTimeOffset Timestamp { get; init; }
            public required Guid UserId { get; init; }
        }

    }

}
