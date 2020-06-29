using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Gopal.EntityFrameworkCore
{
    public partial class gopal_dbContext : DbContext
    {
        public gopal_dbContext()
        {
        }

        public gopal_dbContext(DbContextOptions<gopal_dbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TblClient> TblClient { get; set; }
        public virtual DbSet<TblInward> TblInward { get; set; }
        public virtual DbSet<TblMaterialAccessory> TblMaterialAccessory { get; set; }
        public virtual DbSet<TblModule> TblModule { get; set; }
        public virtual DbSet<TblModulePermission> TblModulePermission { get; set; }
        public virtual DbSet<TblSearchModelNoMaterialTypeCompanyName> TblSearchModelNoMaterialTypeCompanyName { get; set; }
        public virtual DbSet<TblUser> TblUser { get; set; }
        public virtual DbSet<TbleUserRole> TbleUserRole { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=gopalcomputer.database.windows.net;Initial Catalog=gopal_db;Persist Security Info=False;User ID=gopal;Password=Password@123;MultipleActiveResultSets=False;Encrypt=True;");
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

                entity.HasIndex(e => new { e.ClientName, e.CompanyName })
                    .HasName("UX_ClientName_Company_Search");

                entity.HasIndex(e => new { e.ClientName, e.OwnerMobileNo })
                    .HasName("UX_ClientName_MobileNo");

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

            modelBuilder.Entity<TblInward>(entity =>
            {
                entity.HasKey(e => e.InwardId)
                    .HasName("PK__tblInwar__1C628268D3B0608F");

                entity.ToTable("tblInward");

                entity.Property(e => e.AccBarCode).HasMaxLength(200);

                entity.Property(e => e.Accessories).IsUnicode(false);

                entity.Property(e => e.BarCode).HasMaxLength(200);

                entity.Property(e => e.ClientDc)
                    .HasColumnName("ClientDC")
                    .HasMaxLength(200);

                entity.Property(e => e.CompanyName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeliveryDate).HasColumnType("datetime");

                entity.Property(e => e.EnggName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.InwardDate).HasColumnType("datetime");

                entity.Property(e => e.MaterialType)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.MobileNumber)
                    .HasMaxLength(40)
                    .IsUnicode(false);

                entity.Property(e => e.ModelNo)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ProblemDescription).IsUnicode(false);

                entity.Property(e => e.ReceiverName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.RepeatJobDesc).IsUnicode(false);

                entity.Property(e => e.SerialNo).HasMaxLength(200);
            });

            modelBuilder.Entity<TblMaterialAccessory>(entity =>
            {
                entity.HasKey(e => e.MaterialAccessoryId)
                    .HasName("PK__tblMater__0D66E5BFA530355A");

                entity.ToTable("tblMaterialAccessory");

                entity.Property(e => e.AccessoryName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.MaterialType)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
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

            modelBuilder.Entity<TblSearchModelNoMaterialTypeCompanyName>(entity =>
            {
                entity.HasKey(e => e.SearchId)
                    .HasName("PK__tblSearc__21C535F42686BD41");

                entity.ToTable("tblSearchModelNoMaterialTypeCompanyName");

                entity.Property(e => e.CompanyName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.MaterialType)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModelNo)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
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
