using MeetApp.Database;
using MeetApp.Database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
    [Route("/api/v1/offers")]
    public class OffersController : ControllerBase
    {

        private readonly AppDbContext appDbContext;

        public OffersController(
            AppDbContext appDbContext
        )
        {
            this.appDbContext = appDbContext;
        }

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

    }

}
