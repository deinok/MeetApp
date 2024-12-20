﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeetApp.Database.Models
{

    public class Activity
    {

        [Key]
        public Guid Id { get; set; }

        public Guid? OfferId { get; set; }

        public Guid OwnerId { get; set; }

        [Required]
        [StringLength(128)]
        public string Title { get; set; }

        [Required]
        [StringLength(1024)]
        public string Description { get; set; }

        [Required]
        public DateTimeOffset DateTime { get; set; }

        public uint? PeopleLimit { get; set; }

        public string? Location { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        [ForeignKey(nameof(OfferId))]
        [InverseProperty(nameof(Offer.Activities))]
        public virtual Offer? Offer { get; set; }

        [ForeignKey(nameof(OwnerId))]
        [InverseProperty(nameof(User.OwnedActivities))]
        public virtual User Owner { get; set; }

        [InverseProperty(nameof(ActivityMessage.Activity))]
        public virtual ICollection<ActivityMessage> ActivityMessages { get; set; } = [];

    }

}
