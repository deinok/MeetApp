using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeetApp.Database.Models
{
    public class User : IdentityUser<Guid>
    {
        public UserType Type { get; set; }
        public DateTimeOffset RegisterDateTime { get; set; }
        public string? City { get; set; }
        public string? ProfilePicture { get; set; }

        public enum UserType : byte
        {
            Undefined = 0,
            Bussines = 1,
            Student = 2
        }

        /* BUSSINES FIELDS */
        public string BussinesName { get; set; }
        public string BussinesAddress { get; set; }
        public BussinesCategoryType BussinesCategory { get; set; }
        public string CIF { get; set; }
        public string GoogleMapsUrl { get; set; }

        public enum BussinesCategoryType : byte
        {
            Undefined = 0,
            FoodAndDrink = 1,
            Cinema = 2,
        }
        /* BUSSINES FIELDS */

        [InverseProperty(nameof(Activity.Owner))]
        public virtual ICollection<Activity> OwnedActivities { get; set; } = [];

        [InverseProperty(nameof(Offer.Bussines))]
        public virtual ICollection<Offer> Offers { get; set; } = [];


    }

}
