using MeetApp.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.Threading;
using System.Threading.Tasks;

namespace MeetApp.Backend.Controllers.Api.V1
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [ApiExplorerSettings(GroupName = "v1")]
    [Route("/api/v1/stripe")]
    public class StripeController(
        AppDbContext appDbContext,
        StripeClient stripeClient
    ) : ControllerBase
    {

        private readonly AppDbContext appDbContext = appDbContext;
        private readonly StripeClient stripeClient = stripeClient;

        [AllowAnonymous]
        [HttpGet("callback")]
        [ProducesResponseType(StatusCodes.Status302Found)]
        public async Task<IActionResult> CallbackAsync([FromQuery(Name = "checkout-session-id")] string checkoutSessionId, CancellationToken cancellationToken = default)
        {
            var sessionService = new SessionService(this.stripeClient);
            var session = await sessionService.GetAsync(checkoutSessionId, cancellationToken: cancellationToken);
            return this.Ok(checkoutSessionId + "   -   " + session.ClientReferenceId);
        }

    }

}
