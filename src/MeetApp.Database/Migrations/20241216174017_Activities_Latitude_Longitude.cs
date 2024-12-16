using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetApp.Database.Migrations
{
    /// <inheritdoc />
    public partial class Activities_Latitude_Longitude : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Latitude",
                table: "Activities",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Longitude",
                table: "Activities",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Activities");
        }
    }
}
