using MeetApp.Database;
using MeetApp.Database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;
using static MeetApp.Backend.Controllers.Api.V1.OffersController;
using Activity = MeetApp.Database.Models.Activity;

namespace MeetApp.Backend.Controllers.Api.V1
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [ApiExplorerSettings(GroupName = "v1")]
    [Route("/api/v1/activities")]
    public class ActivitiesController : ControllerBase
    {
        private readonly AppDbContext appDbContext;
        public ActivitiesController(
            AppDbContext appDbContext
            )
        {
            this.appDbContext = appDbContext;
        }

        [AllowAnonymous]
        [HttpGet]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<ActivityReadResponse>>(StatusCodes.Status200OK)]
        [ProducesResponseType<ICollection<ActivityReadResponse>>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ReadAsync(CancellationToken cancellationToken = default)
        {
            var activities = await this.Read().ToListAsync(cancellationToken);
            return this.Ok(activities);
        }
        [AllowAnonymous]
        [HttpGet("{date}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ActivityReadResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllByDateAsync([FromRoute][Required] DateTime date, CancellationToken cancellationToken=default)
        {
            var activities = await appDbContext.Activities
                .Where(x=>x.DateTime.Date == date.Date)
                .ToListAsync(cancellationToken);
            if(activities is null)
            {
                return this.NotFound();
            }
            return this.Ok(activities);
        }
        [AllowAnonymous]
        [Consumes(MediaTypeNames.Application.Json)]
        [HttpPost]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<ActivityCreateRequest>>(StatusCodes.Status200OK)]
        [ProducesResponseType<ICollection<ActivityCreateRequest>>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAsync([FromBody][Required] ActivityCreateRequest activityCreateRequest, CancellationToken cancellationToken=default)
        {
           var activity= new Activity
           {
               OfferId = activityCreateRequest.OfferId,
               OwnerId = activityCreateRequest.OwnerId,
               Title = activityCreateRequest.Title,
               Description = activityCreateRequest.Description,
               DateTime = activityCreateRequest.DateTime,
               PeopleLimit = activityCreateRequest.PeopleLimit
           };
           this.appDbContext.Activities.Add(activity);
            _ = await this.appDbContext.SaveChangesAsync(cancellationToken);
            return this.Ok(new ActivityCreateRequest
            {
                OfferId = activity.OfferId,
                OwnerId = activity.OwnerId,
                Title = activity.Title,
                Description = activity.Description,
                DateTime = activity.DateTime,
                PeopleLimit = activity.PeopleLimit
            });
        }

        [AllowAnonymous]
        [HttpDelete("{id}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAsync([FromRoute][Required] Guid id, CancellationToken cancellationToken = default)
        {
            var activity = await this.appDbContext.Activities
                .Where(x => x.Id == id)
                .SingleOrDefaultAsync(cancellationToken);
            if (activity is null)
            {
                return NotFound();
            }
            this.appDbContext.Activities.Remove(activity);
            _ = await this.appDbContext.SaveChangesAsync(cancellationToken);
            return this.Ok(activity);
        }

        [AllowAnonymous]
        [HttpPut("{id}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ActivityUpdateRequest>(StatusCodes.Status200OK)]
        [ProducesResponseType<ActivityUpdateRequest>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAsync([FromRoute][Required] Guid id, [FromBody][Required] ActivityUpdateRequest activityUpdateRequest, CancellationToken cancellationToken = default)
        {
            var activity = await this.appDbContext.Activities
                .Where(x => x.Id == id)
                .SingleOrDefaultAsync(cancellationToken);
            if (activity is null)
            {
                return NotFound();
            }
            activity.OfferId = activityUpdateRequest.OfferId;
            activity.OwnerId = activityUpdateRequest.OwnerId;
            activity.Title = activityUpdateRequest.Title;
            activity.Description = activityUpdateRequest.Description;
            activity.DateTime = activityUpdateRequest.DateTime;
            activity.PeopleLimit = activityUpdateRequest.PeopleLimit;
            _ = await this.appDbContext.SaveChangesAsync(cancellationToken);
            return Ok(activity);
        }

        private IQueryable<ActivityReadResponse> Read()
        {
            return this.appDbContext.Activities
                .Select(x => new ActivityReadResponse()
                {
                    DateTime = x.DateTime,
                    Description = x.Description,
                    Title = x.Title,
                    OfferId = x.OfferId,
                    OwnerId = x.OwnerId,
                    PeopleLimit = x.PeopleLimit
                });
        }
        public record ActivityUpdateRequest
        {
            public Guid? OfferId { get; set; }

            public Guid OwnerId { get; set; }

            public required string Title { get; set; }

            public required string Description { get; set; }

            public DateTimeOffset DateTime { get; set; }

            public uint? PeopleLimit { get; set; }
        }
        public record ActivityReadResponse
        {
            public Guid? OfferId { get; set; }

            public Guid OwnerId { get; set; }
            
            public required string Title { get; set; }
            
            public required string Description { get; set; }
            
            public DateTimeOffset DateTime { get; set; }
            
            public uint? PeopleLimit { get; set; }
            
        }
        public record ActivityCreateRequest
        {
            public Guid? OfferId { get; set; }

            public Guid OwnerId { get; set; }

            public required string Title { get; set; }

            public required string Description { get; set; }

            public DateTimeOffset DateTime { get; set; }

            public uint? PeopleLimit { get; set; }

        }
    }
}
