using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetApp.Database.Models
{

    public class ActivityMessage
    {

        [Key]
        public Guid Id { get; set; }

        public Guid ActivityId { get; set; }

        public Guid UserId { get; set; }

        [Required]
        [StringLength(1024)]
        public string Message { get; set; }

        [Required]
        public DateTimeOffset Timestamp { get; set; }

        [ForeignKey(nameof(ActivityId))]
        [InverseProperty(nameof(Activity.ActivityMessages))]
        public virtual Activity Activity { get; set; }

        [ForeignKey(nameof(UserId))]
        [InverseProperty(nameof(User.ActivityMessages))]
        public virtual User User { get; set; }

    }

}
