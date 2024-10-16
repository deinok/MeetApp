using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeetApp.Database.Models
{

    public class Offer
    {
        [Key]
        public Guid Id { get; set; }

        public Guid BusinessId { get; set; }

        [Required]
        [StringLength(128)]
        public string Title { get; set; }

        [Required]
        [StringLength(1024)]
        public string Description { get; set; }

        [Required]
        public DateOnly ExpirationDate { get; set; }

        [StringLength(16)]
        public string Tag { get; set; }

        [ForeignKey(nameof(BusinessId))]
        [InverseProperty(nameof(User.Offers))]
        public virtual User Bussines { get; set; }
    }


}
