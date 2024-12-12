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
    [Route("/api/v1/offer")]
    [Route("/api/v1/offers")]
    public class OfferController(
        AppDbContext appDbContext
    ) : ControllerBase
    {

        private readonly AppDbContext appDbContext = appDbContext;

        [AllowAnonymous]
        [Consumes(MediaTypeNames.Application.Json)]
        [HttpPost]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<OfferCreateResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<OfferCreateResponse>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAsync([FromBody][Required] OfferCreateRequest offerCreateRequest, CancellationToken cancellationToken = default)
        {
            var offer = new Offer
            {
                Bussines = await this.appDbContext.Users
                    .Where(x => x.Id == offerCreateRequest.BussinesId)
                    .SingleAsync(cancellationToken),
                Description = offerCreateRequest.Description,
                ExpirationDate = offerCreateRequest.ExpirationDate,
                Tag = offerCreateRequest.Tag,
                Title = offerCreateRequest.Title,
            };
            this.appDbContext.Offers.Add(offer);
            _ = await this.appDbContext.SaveChangesAsync(cancellationToken);
            return this.Ok(new OfferCreateResponse
            {
                BussinesId = offer.Bussines.Id,
                Description = offer.Description,
                ExpirationDate = offer.ExpirationDate,
                Id = offer.Id,
                Tag = offer.Tag,
                Title = offer.Title,
            });
        }

        [AllowAnonymous]
        [HttpGet]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<OfferReadResponse>>(StatusCodes.Status200OK)]
        [ProducesResponseType<ICollection<OfferReadResponse>>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ReadAsync(CancellationToken cancellationToken = default)
        {
            var result = await this.Read()
                .ToListAsync(cancellationToken);
            return this.Ok(result);
        }
        [AllowAnonymous]
        [HttpGet("getoffers")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<OfferPaidResponse>>(StatusCodes.Status200OK)]
        [ProducesResponseType<ICollection<OfferPaidResponse>>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByPaid(CancellationToken cancellationToken = default)
        {
            var result = await appDbContext.Offers
                .Where(offer => offer.Paid)
                .Include(offer => offer.Bussines)
                .OrderBy(offer => offer.Bussines.BussinesName)
                .Select(offer => new OfferPaidResponse
                {
                    BussinesId = offer.Bussines.Id,
                    BusinessName = offer.Bussines.BussinesName,
                    Description = offer.Description,
                    ExpirationDate = offer.ExpirationDate,
                    Id = offer.Id,
                    Paid = offer.Paid,
                    Tag = offer.Tag,
                    Title = offer.Title,
                })
                .ToListAsync(cancellationToken);
            return this.Ok(result);
        }
        public record OfferPaidResponse
        {
            public required Guid BussinesId { get; init; }
            public required string BusinessName { get; init; }
            public required string Description { get; init; }
            public required DateOnly ExpirationDate { get; init; }
            public required Guid Id { get; init; }
            public required bool Paid { get; init; }
            public string? Tag { get; init; }
            public required string Title { get; init; }
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<OfferReadResponse>>(StatusCodes.Status200OK)]
        [ProducesResponseType<ICollection<OfferReadResponse>>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ReadAsync([FromRoute] Guid id, CancellationToken cancellationToken = default)
        {
            var result = await this.Read()
                .Where(x => x.Id == id)
                .ToListAsync(cancellationToken);
            return this.Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("business/{businessId}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<ICollection<OfferReadResponse>>(StatusCodes.Status200OK)]
        [ProducesResponseType<ICollection<OfferReadResponse>>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByBusinessId([FromRoute] Guid businessId, CancellationToken cancellationToken = default)
        {
            var result = await this.Read()
                .Where(offer => offer.BussinesId == businessId)
                .ToListAsync(cancellationToken);
            return this.Ok(result);
        }

        private IQueryable<OfferReadResponse> Read()
        {
            return this.appDbContext.Offers
                .Select(x => new OfferReadResponse
                {
                    BussinesId = x.Bussines.Id,
                    Description = x.Description,
                    ExpirationDate = x.ExpirationDate,
                    Id = x.Id,
                    Paid = x.Paid,
                    Tag = x.Tag,
                    Title = x.Title,
                });
        }
        public record OfferCreateRequest
        {
            public required Guid BussinesId { get; init; }
            public required string Description { get; init; }
            public required DateOnly ExpirationDate { get; init; }
            public string? Tag { get; init; }
            public required string Title { get; init; }
        }

        public record OfferCreateResponse
        {
            public required Guid BussinesId { get; init; }
            public required string Description { get; init; }
            public required DateOnly ExpirationDate { get; init; }
            public required Guid Id { get; init; }
            public string? Tag { get; init; }
            public required string Title { get; init; }
        }

        public record OfferReadResponse
        {
            public required Guid BussinesId { get; init; }
            public required string Description { get; init; }
            public required DateOnly ExpirationDate { get; init; }
            public required Guid Id { get; init; }
            public required bool Paid { get; init; }
            public string? Tag { get; init; }
            public required string Title { get; init; }
        }


        [AllowAnonymous]
        [HttpDelete("{id}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id, CancellationToken cancellationToken = default)
        {
            var offer = await appDbContext.Offers.Where(x => x.Id == id).FirstOrDefaultAsync(cancellationToken);
            if (offer == null)
            {
                return NotFound();
            }
            appDbContext.Offers.Remove(offer);
            _ = appDbContext.SaveChangesAsync(cancellationToken);
            return Ok();
        }
        [AllowAnonymous]
        [HttpPut("{id}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType<OfferCreateResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<OfferCreateResponse>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody][Required] OfferUpdateRequest offerUpdateRequest, CancellationToken cancellationToken = default)
        {
            var offer = await appDbContext.Offers.Where(x => x.Id == id).FirstOrDefaultAsync(cancellationToken);
            if (offer == null)
            {
                return NotFound();
            }
            offer.Description = offerUpdateRequest.Description;
            offer.ExpirationDate = offerUpdateRequest.ExpirationDate;
            offer.Tag = offerUpdateRequest.Tag;
            offer.Title = offerUpdateRequest.Title;
            _ = await appDbContext.SaveChangesAsync(cancellationToken);
            return Ok();
        }
        public record OfferUpdateRequest
        {
            public required string Description { get; init; }
            public required DateOnly ExpirationDate { get; init; }
            public string? Tag { get; init; }
            public required string Title { get; init; }
        }
    }

}
