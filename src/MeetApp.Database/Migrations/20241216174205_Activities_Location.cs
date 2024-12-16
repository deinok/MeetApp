using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetApp.Database.Migrations
{
    /// <inheritdoc />
    public partial class Activities_Location : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Activities",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Activities");
        }
    }
}
