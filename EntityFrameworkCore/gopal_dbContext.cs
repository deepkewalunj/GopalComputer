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

        public virtual DbSet<TblBill> TblBill { get; set; }
        public virtual DbSet<TblBillAndInwardDetail> TblBillAndInwardDetail { get; set; }
        public virtual DbSet<TblClient> TblClient { get; set; }
        public virtual DbSet<TblClientOpeningBalanceHistory> TblClientOpeningBalanceHistory { get; set; }
        public virtual DbSet<TblInward> TblInward { get; set; }
        public virtual DbSet<TblInwardDocument> TblInwardDocument { get; set; }
        public virtual DbSet<TblMaterialAccessory> TblMaterialAccessory { get; set; }
        public virtual DbSet<TblModule> TblModule { get; set; }
        public virtual DbSet<TblModulePermission> TblModulePermission { get; set; }
        public virtual DbSet<TblOutward> TblOutward { get; set; }
        public virtual DbSet<TblOutwardAndInwardDetail> TblOutwardAndInwardDetail { get; set; }
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

            modelBuilder.Entity<TblBill>(entity =>
            {
                entity.HasKey(e => e.BillId)
                    .HasName("PK__tblBill__6D903F037994B00B");

                entity.ToTable("tblBill");

                entity.Property(e => e.BillId).HasColumnName("billId");

                entity.Property(e => e.AdvanceAmount).HasColumnName("advanceAmount");

                entity.Property(e => e.BillDate)
                    .HasColumnName("billDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EnggName)
                    .HasColumnName("enggName")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.MaterialAdded).HasColumnName("materialAdded");

                entity.Property(e => e.MaterialUsed).HasColumnName("materialUsed");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.OutstandingAmount).HasColumnName("outstandingAmount");

                entity.Property(e => e.PaidImmediatlyAmount).HasColumnName("paidImmediatlyAmount");

                entity.Property(e => e.PaymentMode).HasColumnName("paymentMode");

                entity.Property(e => e.PaymentRecievedBy)
                    .HasColumnName("paymentRecievedBy")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.PrintStatus).HasColumnName("printStatus");

                entity.Property(e => e.ServiceAmount).HasColumnName("serviceAmount");

                entity.Property(e => e.SmsSent).HasColumnName("smsSent");

                entity.Property(e => e.TestedOk).HasColumnName("testedOk");
            });

            modelBuilder.Entity<TblBillAndInwardDetail>(entity =>
            {
                entity.HasKey(e => e.BillAndInwardId)
                    .HasName("PK__tblBillA__77253CA43AFF77D7");

                entity.ToTable("tblBillAndInwardDetail");

                entity.Property(e => e.BillAndInwardId).HasColumnName("billAndInwardId");

                entity.Property(e => e.BillIdRef).HasColumnName("billIdRef");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.InwardIdRef).HasColumnName("inwardIdRef");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");
            });

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

                entity.Property(e => e.BalanceAmount).HasColumnName("balanceAmount");

                entity.Property(e => e.ClientAddress)
                    .HasColumnName("clientAddress")
                    .IsUnicode(false);

                entity.Property(e => e.ClientEmail)
                    .HasColumnName("clientEmail")
                    .HasMaxLength(100)
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

            modelBuilder.Entity<TblClientOpeningBalanceHistory>(entity =>
            {
                entity.HasKey(e => e.ClientOpeningBalanceHistoryId)
                    .HasName("PK__tblClien__582CCEFFA4474BBA");

                entity.ToTable("tblClientOpeningBalanceHistory");

                entity.Property(e => e.ClientOpeningBalanceHistoryId).HasColumnName("clientOpeningBalanceHistoryId");

                entity.Property(e => e.BillIdRef).HasColumnName("billIdRef");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreditedAmount).HasColumnName("creditedAmount");

                entity.Property(e => e.DebitedAmount).HasColumnName("debitedAmount");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.NewBalance).HasColumnName("newBalance");

                entity.Property(e => e.OldBalance).HasColumnName("oldBalance");

                entity.Property(e => e.OutwardIdRef).HasColumnName("outwardIdRef");
            });

            modelBuilder.Entity<TblInward>(entity =>
            {
                entity.HasKey(e => e.InwardId)
                    .HasName("PK__tblInwar__1C628268D3B0608F");

                entity.ToTable("tblInward");

                entity.Property(e => e.InwardId).HasColumnName("inwardId");

                entity.Property(e => e.AccBarCode)
                    .HasColumnName("accBarCode")
                    .HasMaxLength(200);

                entity.Property(e => e.Accessories)
                    .HasColumnName("accessories")
                    .IsUnicode(false);

                entity.Property(e => e.AdvanceAmount).HasColumnName("advanceAmount");

                entity.Property(e => e.BarCode)
                    .HasColumnName("barCode")
                    .HasMaxLength(200);

                entity.Property(e => e.ClientDc)
                    .HasColumnName("clientDC")
                    .HasMaxLength(200);

                entity.Property(e => e.ClientRefId).HasColumnName("clientRefId");

                entity.Property(e => e.CompanyName)
                    .HasColumnName("companyName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.DeliveryDate)
                    .HasColumnName("deliveryDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EnggName)
                    .HasColumnName("enggName")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.EstmRepairingAmount).HasColumnName("estmRepairingAmount");

                entity.Property(e => e.InwardDate)
                    .HasColumnName("inwardDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.IsOwner).HasColumnName("isOwner");

                entity.Property(e => e.IsProblemDetected).HasColumnName("isProblemDetected");

                entity.Property(e => e.IsRepaired).HasColumnName("isRepaired");

                entity.Property(e => e.IsSpecialJob).HasColumnName("isSpecialJob");

                entity.Property(e => e.MaterialType)
                    .HasColumnName("materialType")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.MobileNumber)
                    .HasColumnName("mobileNumber")
                    .HasMaxLength(40)
                    .IsUnicode(false);

                entity.Property(e => e.ModelNo)
                    .HasColumnName("modelNo")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.OutwardBillStatus).HasColumnName("outwardBillStatus");

                entity.Property(e => e.PrintStatus).HasColumnName("printStatus");

                entity.Property(e => e.ProblemDescription)
                    .HasColumnName("problemDescription")
                    .IsUnicode(false);

                entity.Property(e => e.ReceiverName)
                    .HasColumnName("receiverName")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.RepairedRemark)
                    .HasColumnName("repairedRemark")
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.RepeatJob).HasColumnName("repeatJob");

                entity.Property(e => e.RepeatJobDesc)
                    .HasColumnName("repeatJobDesc")
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.SerialNo)
                    .HasColumnName("serialNo")
                    .HasMaxLength(200);

                entity.Property(e => e.SmsStatus).HasColumnName("smsStatus");
            });

            modelBuilder.Entity<TblInwardDocument>(entity =>
            {
                entity.HasKey(e => e.InwardDocumentId)
                    .HasName("PK__tblInwar__C2055DA5ACEEE590");

                entity.ToTable("tblInwardDocument");

                entity.Property(e => e.InwardDocumentId).HasColumnName("inwardDocumentId");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.DocumentName)
                    .HasColumnName("documentName")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.DocumentPath)
                    .HasColumnName("documentPath")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.InwardRefId).HasColumnName("inwardRefId");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");
            });

            modelBuilder.Entity<TblMaterialAccessory>(entity =>
            {
                entity.HasKey(e => e.MaterialAccessoryId)
                    .HasName("PK__tblMater__0D66E5BFA530355A");

                entity.ToTable("tblMaterialAccessory");

                entity.Property(e => e.MaterialAccessoryId).HasColumnName("materialAccessoryId");

                entity.Property(e => e.AccessoryName)
                    .HasColumnName("accessoryName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.MaterialType)
                    .HasColumnName("materialType")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");
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

            modelBuilder.Entity<TblOutward>(entity =>
            {
                entity.HasKey(e => e.OutwardId)
                    .HasName("PK__tblOutwa__ADD89F60CB83E7F0");

                entity.ToTable("tblOutward");

                entity.Property(e => e.OutwardId).HasColumnName("outwardId");

                entity.Property(e => e.AdvanceAmount).HasColumnName("advanceAmount");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EnggName)
                    .HasColumnName("enggName")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.MaterialAdded).HasColumnName("materialAdded");

                entity.Property(e => e.MaterialUsed).HasColumnName("materialUsed");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.OutstandingAmount).HasColumnName("outstandingAmount");

                entity.Property(e => e.OutwardDate)
                    .HasColumnName("outwardDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.PaidImmediatlyAmount).HasColumnName("paidImmediatlyAmount");

                entity.Property(e => e.PaymentMode).HasColumnName("paymentMode");

                entity.Property(e => e.PaymentRecievedBy)
                    .HasColumnName("paymentRecievedBy")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.PrintStatus).HasColumnName("printStatus");

                entity.Property(e => e.ServiceAmount).HasColumnName("serviceAmount");

                entity.Property(e => e.SmsSent).HasColumnName("smsSent");

                entity.Property(e => e.TestedOk).HasColumnName("testedOk");
            });

            modelBuilder.Entity<TblOutwardAndInwardDetail>(entity =>
            {
                entity.HasKey(e => e.OutwardAndInwardId)
                    .HasName("PK__tblOutwa__B2B5D4113D123C7C");

                entity.ToTable("tblOutwardAndInwardDetail");

                entity.Property(e => e.OutwardAndInwardId).HasColumnName("outwardAndInwardId");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.InwardIdRef).HasColumnName("inwardIdRef");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.OutwardIdRef).HasColumnName("outwardIdRef");
            });

            modelBuilder.Entity<TblSearchModelNoMaterialTypeCompanyName>(entity =>
            {
                entity.HasKey(e => e.SearchId)
                    .HasName("PK__tblSearc__21C535F42686BD41");

                entity.ToTable("tblSearchModelNoMaterialTypeCompanyName");

                entity.Property(e => e.SearchId).HasColumnName("searchId");

                entity.Property(e => e.CompanyName)
                    .HasColumnName("companyName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.CreatedDate)
                    .HasColumnName("createdDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.MaterialType)
                    .HasColumnName("materialType")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModelNo)
                    .HasColumnName("modelNo")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedBy).HasColumnName("modifiedBy");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnName("modifiedDate")
                    .HasColumnType("datetime");
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
