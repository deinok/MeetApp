using MeetApp.Database;
using MeetApp.Database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;

namespace MeetApp.Backend.Controllers.Api.V1
{

	[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[ApiController]
	[ApiExplorerSettings(GroupName = "v1")]
	[Route("/api/v1/activity")]
	[Route("/api/v1/activities")]
	public class ActivityController(
		AppDbContext appDbContext
	) : ControllerBase
	{

		private readonly AppDbContext appDbContext = appDbContext;

		[AllowAnonymous]
		[HttpGet]
		[Produces(MediaTypeNames.Application.Json)]
		[ProducesResponseType<ICollection<ActivityGetResponse>>(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> GetAsync(CancellationToken cancellationToken = default)
		{
			var activity = await this.Read().ToListAsync(cancellationToken);
			return this.Ok(activity);
		}

		[AllowAnonymous]
		[HttpGet("{date}")]
		[Produces(MediaTypeNames.Application.Json)]
		[ProducesResponseType<ActivityGetResponse>(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> GetByDate([FromRoute][Required] DateTime date, CancellationToken cancellationToken = default)
		{
			var activities = await this.Read()
				.Where(x => x.DateTime.Date == date.Date)
				.ToListAsync(cancellationToken);
			return this.Ok(activities);
		}
		[AllowAnonymous]
		[HttpGet("date")]
		[Produces(MediaTypeNames.Application.Json)]
		[ProducesResponseType<ICollection<ActivityGetByDateResponse>>(StatusCodes.Status200OK)]
		[ProducesResponseType<ICollection<ActivityGetByDateResponse>>(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> GetByDateAsync(DateTime dateTimeFrom, CancellationToken cancellationToken = default)
		{
			var startDate = dateTimeFrom.ToUniversalTime();
			var endDate = startDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59).ToUniversalTime();

			var results = await appDbContext.Offers.SelectMany(x => x.Activities)
				.Where(activity => activity.DateTime >= startDate && activity.DateTime <= endDate && activity.OfferId.HasValue)
				.Select(x => new ActivityGetByDateResponse
				{
					Title = x.Title,
					Description = x.Description,
					DateTime = x.DateTime.ToString("o"),
					PeopleLimit = x.PeopleLimit,
					BusinessName = x.Offer != null ? x.Offer.Bussines.BussinesName : " "
				}).ToListAsync(cancellationToken);
			return Ok(results);
		}
		public record ActivityGetByDateResponse
		{
			public required string Title { get; init; }
			public required string Description { get; init; }
			public required string DateTime { get; init; }
			public uint? PeopleLimit { get; init; }
			public required string BusinessName { get; init; }
		}

		[AllowAnonymous]
		[Consumes(MediaTypeNames.Application.Json)]
		[HttpPost]
		[Produces(MediaTypeNames.Application.Json)]
		[ProducesResponseType<ICollection<ActivityCreateRequest>>(StatusCodes.Status200OK)]
		[ProducesResponseType<ICollection<ActivityCreateRequest>>(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> CreateAsync([FromBody][Required] ActivityCreateRequest activityCreateRequest, CancellationToken cancellationToken = default)
		{
			var offer = await this.appDbContext.Offers
				.Include(x => x.Bussines)
				.Where(x => x.Id == activityCreateRequest.OfferId)
				.SingleOrDefaultAsync(cancellationToken);
			var activity = new Activity
			{
				OfferId = activityCreateRequest.OfferId,
				OwnerId = activityCreateRequest.OwnerId,
				Title = activityCreateRequest.Title,
				Description = activityCreateRequest.Description,
				DateTime = activityCreateRequest.DateTime,
				PeopleLimit = activityCreateRequest.PeopleLimit,
				Location = activityCreateRequest.Location,
				Latitude = activityCreateRequest.Latitude,
				Longitude = activityCreateRequest.Longitude
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
				PeopleLimit = activity.PeopleLimit,
				Location = activityCreateRequest.Location,
				Latitude = activityCreateRequest.Latitude,
				Longitude = activityCreateRequest.Longitude
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

		private IQueryable<ActivityGetResponse> Read()
		{
			return this.appDbContext.Activities
				.Select(x => new ActivityGetResponse()
				{
					DateTime = x.DateTime,
					Description = x.Description,
					Id = x.Id,
					Latitude = x.Latitude,
					Location = x.Location,
					Longitude = x.Longitude,
					OfferId = x.OfferId,
					OwnerId = x.OwnerId,
					PeopleLimit = x.PeopleLimit,
					Title = x.Title,
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

		public record ActivityGetResponse
		{
			public required Guid Id { get; init; }

			public required Guid? OfferId { get; init; }

			public required Guid OwnerId { get; init; }

			public required string Title { get; init; }

			public required string Description { get; init; }
			
			public required DateTimeOffset DateTime { get; init; }

			public required uint? PeopleLimit { get; init; }

			public required string? Location { get; init; }
			
			public required decimal? Latitude { get; init; }

			public required decimal? Longitude { get; init; }

		}

		public record ActivityCreateRequest
		{
			public Guid? OfferId { get; set; }

			public Guid OwnerId { get; set; }

			public required string Title { get; set; }

			public required string Description { get; set; }

			public DateTimeOffset DateTime { get; set; }

			public uint? PeopleLimit { get; set; }
			
			public required string? Location { get; set; }
			
			public required decimal? Latitude { get; set; }

			public required decimal? Longitude { get; set; }
			
			

		}

	}

}
