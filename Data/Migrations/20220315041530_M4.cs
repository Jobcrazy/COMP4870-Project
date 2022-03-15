using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Data.Migrations
{
    public partial class M4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expense_Category_categoryId",
                table: "Expense");

            migrationBuilder.RenameColumn(
                name: "categoryId",
                table: "Expense",
                newName: "cid");

            migrationBuilder.RenameIndex(
                name: "IX_Expense_categoryId",
                table: "Expense",
                newName: "IX_Expense_cid");

            migrationBuilder.AddForeignKey(
                name: "FK_Expense_Category_cid",
                table: "Expense",
                column: "cid",
                principalTable: "Category",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expense_Category_cid",
                table: "Expense");

            migrationBuilder.RenameColumn(
                name: "cid",
                table: "Expense",
                newName: "categoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Expense_cid",
                table: "Expense",
                newName: "IX_Expense_categoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expense_Category_categoryId",
                table: "Expense",
                column: "categoryId",
                principalTable: "Category",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
