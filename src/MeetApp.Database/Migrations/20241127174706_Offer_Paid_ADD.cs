using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetApp.Database.Migrations
{
	/// <inheritdoc />
	public partial class Offer_Paid_ADD : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<bool>(
				name: "Paid",
				table: "Offers",
				type: "boolean",
				nullable: false,
				defaultValue: false);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
				name: "Paid",
				table: "Offers");
		}
	}
}
