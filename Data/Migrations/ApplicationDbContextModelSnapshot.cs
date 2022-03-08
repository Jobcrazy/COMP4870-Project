﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Data;

#nullable disable

namespace backend.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.1");

            modelBuilder.Entity("backend.Models.Category", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("uid")
                        .HasColumnType("INTEGER");

                    b.HasKey("id");

                    b.HasIndex("uid")
                        .IsUnique();

                    b.ToTable("Category");
                });

            modelBuilder.Entity("backend.Models.Expense", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<double>("amount")
                        .HasColumnType("REAL");

                    b.Property<int>("category")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("date")
                        .HasColumnType("TEXT");

                    b.Property<string>("note")
                        .HasColumnType("TEXT");

                    b.Property<int>("uid")
                        .HasColumnType("INTEGER");

                    b.HasKey("id");

                    b.HasIndex("uid", "date");

                    b.ToTable("Expense");
                });

            modelBuilder.Entity("backend.Models.Goal", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<double>("amount")
                        .HasColumnType("REAL");

                    b.Property<DateTime>("date")
                        .HasColumnType("TEXT");

                    b.Property<int>("uid")
                        .HasColumnType("INTEGER");

                    b.HasKey("id");

                    b.HasIndex("uid", "date")
                        .IsUnique();

                    b.ToTable("Goal");
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("fname")
                        .HasColumnType("TEXT");

                    b.Property<string>("gid")
                        .HasColumnType("TEXT");

                    b.Property<string>("gname")
                        .HasColumnType("TEXT");

                    b.Property<string>("head")
                        .HasColumnType("TEXT");

                    b.Property<string>("xname")
                        .HasColumnType("TEXT");

                    b.HasKey("id");

                    b.HasIndex("gid")
                        .IsUnique();

                    b.ToTable("User");
                });

            modelBuilder.Entity("backend.Models.Category", b =>
                {
                    b.HasOne("backend.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("uid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("user");
                });

            modelBuilder.Entity("backend.Models.Expense", b =>
                {
                    b.HasOne("backend.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("uid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("user");
                });

            modelBuilder.Entity("backend.Models.Goal", b =>
                {
                    b.HasOne("backend.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("uid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("user");
                });
#pragma warning restore 612, 618
        }
    }
}
