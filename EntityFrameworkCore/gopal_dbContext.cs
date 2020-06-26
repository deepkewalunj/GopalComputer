using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace Gopal.EntityFrameworkCore
{
    public partial class gopal_dbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        public gopal_dbContext()
        {
        }

        public gopal_dbContext(IConfiguration configuration, DbContextOptions<gopal_dbContext> options)
            : base(options)
        {
            _configuration = configuration;
        }

        public virtual DbSet<TblClient> TblClient { get; set; }
        public virtual DbSet<TblModule> TblModule { get; set; }
        public virtual DbSet<TblModulePermission> TblModulePermission { get; set; }
        public virtual DbSet<TblUser> TblUser { get; set; }
        public virtual DbSet<TbleUserRole> TbleUserRole { get; set; }

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
                    .HasName("PK__tblClien__81A2CBE14BF32AA0");

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

            modelBuilder.Entity<TblModule>(entity =>
            {
                entity.HasKey(e => e.ModuleId)
                    .HasName("PK__tblModul__8EEC8E1700FB6455");

                entity.ToTable("tblModule");

                entity.Property(e => e.ModuleId).HasColumnName("moduleId");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.ModuleName)
                    .HasColumnName("moduleName")
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TblModulePermission>(entity =>
            {
                entity.HasKey(e => e.ModulePermissionIdRef)
                    .HasName("PK__tblModul__8D7698AE74C1373E");

                entity.ToTable("tblModulePermission");

                entity.Property(e => e.ModulePermissionIdRef).HasColumnName("modulePermissionIdRef");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.ModuleIdRef).HasColumnName("moduleIdRef");

                entity.Property(e => e.UserUserIdRef).HasColumnName("userUserIdRef");
            });

            modelBuilder.Entity<TblUser>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PK__tblUser__CB9A1CFF6103F4C9");

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

            modelBuilder.Entity<TbleUserRole>(entity =>
            {
                entity.HasKey(e => e.UserRoleId)
                    .HasName("PK__tbleUser__CD3149CC9D24AE6A");

                entity.ToTable("tbleUserRole");

                entity.Property(e => e.UserRoleId).HasColumnName("userRoleId");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.UserRoleName)
                    .HasColumnName("userRoleName")
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });
        }
    }
}
