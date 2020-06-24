using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace Gopal.EntityFrameworkCore
{
    public partial class GopalDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public GopalDbContext( IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public GopalDbContext(DbContextOptions<GopalDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TblClient> TblClient { get; set; }
        public virtual DbSet<TblUser> TblUser { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                 optionsBuilder.UseSqlServer(_configuration["ConnectionString"]);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity<TblClient>(entity =>
            {
                entity.HasKey(e => e.ClientId)
                    .HasName("PK__tblClien__81A2CBE1C664C3DC");

                entity.ToTable("tblClient");

                entity.Property(e => e.ClientId).HasColumnName("clientId");

                entity.Property(e => e.ClientAddress)
                    .HasColumnName("clientAddress")
                    .IsUnicode(false);

                entity.Property(e => e.ClientName)
                    .HasColumnName("clientName")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ClientTitleId).HasColumnName("clientTitleId");

                entity.Property(e => e.CompanyName)
                    .HasColumnName("companyName")
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.MobileNoFirst)
                    .HasColumnName("mobileNoFirst")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.OwnerMobileNo)
                    .HasColumnName("ownerMobileNo")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.TelNoFirst)
                    .HasColumnName("telNoFirst")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.TelNoSecond)
                    .HasColumnName("telNoSecond")
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TblUser>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PK__tblUser__CB9A1CFF3344CD0B");

                entity.ToTable("tblUser");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.FirstName)
                    .HasColumnName("firstName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.LastName)
                    .HasColumnName("lastName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.MiddleName)
                    .HasColumnName("middleName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.UserEmail)
                    .HasColumnName("userEmail")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.UserName)
                    .HasColumnName("userName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UserPassword)
                    .HasColumnName("userPassword")
                    .IsUnicode(false);

                entity.Property(e => e.UserRole).HasColumnName("userRole");
            });
        }
    }
}
