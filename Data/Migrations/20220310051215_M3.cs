using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Data.Migrations
{
    public partial class M3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Category_uid",
                table: "Category");

            migrationBuilder.RenameColumn(
                name: "category",
                table: "Expense",
                newName: "categoryId");

            migrationBuilder.RenameColumn(
                name: "CategoryName",
                table: "Category",
                newName: "categoryName");

            migrationBuilder.CreateIndex(
                name: "IX_Expense_categoryId",
                table: "Expense",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Category_uid_categoryName",
                table: "Category",
                columns: new[] { "uid", "categoryName" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Expense_Category_categoryId",
                table: "Expense",
                column: "categoryId",
                principalTable: "Category",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expense_Category_categoryId",
                table: "Expense");

            migrationBuilder.DropIndex(
                name: "IX_Expense_categoryId",
                table: "Expense");

            migrationBuilder.DropIndex(
                name: "IX_Category_uid_categoryName",
                table: "Category");

            migrationBuilder.RenameColumn(
                name: "categoryId",
                table: "Expense",
                newName: "category");

            migrationBuilder.RenameColumn(
                name: "categoryName",
                table: "Category",
                newName: "CategoryName");

            migrationBuilder.CreateIndex(
                name: "IX_Category_uid",
                table: "Category",
                column: "uid",
                unique: true);
        }
    }
}
