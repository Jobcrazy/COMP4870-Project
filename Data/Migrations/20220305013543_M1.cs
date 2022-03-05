using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Data.Migrations
{
    public partial class M1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    gid = table.Column<string>(type: "TEXT", nullable: true),
                    fname = table.Column<string>(type: "TEXT", nullable: true),
                    gname = table.Column<string>(type: "TEXT", nullable: true),
                    xname = table.Column<string>(type: "TEXT", nullable: true),
                    head = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Expense",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    uid = table.Column<int>(type: "INTEGER", nullable: false),
                    category = table.Column<int>(type: "INTEGER", nullable: false),
                    amount = table.Column<double>(type: "REAL", nullable: false),
                    note = table.Column<string>(type: "TEXT", nullable: true),
                    date = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expense", x => x.id);
                    table.ForeignKey(
                        name: "FK_Expense_User_uid",
                        column: x => x.uid,
                        principalTable: "User",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Goal",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    uid = table.Column<int>(type: "INTEGER", nullable: false),
                    amount = table.Column<double>(type: "REAL", nullable: false),
                    date = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Goal", x => x.id);
                    table.ForeignKey(
                        name: "FK_Goal_User_uid",
                        column: x => x.uid,
                        principalTable: "User",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Expense_uid_date",
                table: "Expense",
                columns: new[] { "uid", "date" });

            migrationBuilder.CreateIndex(
                name: "IX_Goal_uid_date",
                table: "Goal",
                columns: new[] { "uid", "date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_gid",
                table: "User",
                column: "gid",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Expense");

            migrationBuilder.DropTable(
                name: "Goal");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
