using Microsoft.EntityFrameworkCore;
using LibraryManagement.Models;

namespace LibraryManagement.Data
{
    public class LibraryManagermentContext : DbContext
    {
        public LibraryManagermentContext(DbContextOptions<LibraryManagermentContext> options) : base(options) { }

        public DbSet<Reader> Readers { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookReceipt> BookReceipts { get; set; }
        public DbSet<CategoryReport> CategoryReports { get; set; }
        public DbSet<CategoryReportDetail> CategoryReportDetails { get; set; }
        public DbSet<DetailBookReceipt> DetailBookReceipts { get; set; }
        public DbSet<LoanSlipBook> LoanSlipBooks { get; set; }
        public DbSet<OverdueReport> OverdueReports { get; set; }
        public DbSet<Parameter> Parameters { get; set; }
        public DbSet<TypeBook> TypeBooks { get; set; }
        public DbSet<TypeReader> TypeReaders { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<HeaderBook> HeaderBooks { get; set; }
        public DbSet<TheBook> TheBooks { get; set; }
        public DbSet<CreateBook> CreateBooks { get; set; }
        public DbSet<Penalty> Penalties { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Evaluate> Evaluates { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Table names
            modelBuilder.Entity<Reader>().ToTable("reader");
            modelBuilder.Entity<TypeReader>().ToTable("typereader");
            modelBuilder.Entity<TypeBook>().ToTable("typebook");
            modelBuilder.Entity<Author>().ToTable("outhor");
            modelBuilder.Entity<HeaderBook>().ToTable("headerbook");
            modelBuilder.Entity<Book>().ToTable("book");
            modelBuilder.Entity<TheBook>().ToTable("thebook");
            modelBuilder.Entity<CreateBook>().ToTable("create_book");
            modelBuilder.Entity<BookReceipt>().ToTable("bookreceipt");
            modelBuilder.Entity<DetailBookReceipt>().ToTable("detail_bookreceipt");
            modelBuilder.Entity<LoanSlipBook>().ToTable("loan_slipbook");
            modelBuilder.Entity<Penalty>().ToTable("penalty");
            modelBuilder.Entity<CategoryReport>().ToTable("category_report");
            modelBuilder.Entity<CategoryReportDetail>().ToTable("categoty_reportdetail");
            modelBuilder.Entity<OverdueReport>().ToTable("overdue_report");
            modelBuilder.Entity<Image>().ToTable("image");
            modelBuilder.Entity<Evaluate>().ToTable("evaluate");
            modelBuilder.Entity<Role>().ToTable("roles");
            modelBuilder.Entity<Permission>().ToTable("permissions");
            modelBuilder.Entity<RolePermission>().ToTable("role_permission");
            modelBuilder.Entity<Parameter>().ToTable("parameters");

            // Composite primary keys
            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleName, rp.PermissionName });

            modelBuilder.Entity<CategoryReportDetail>()
                .HasKey(c => new { c.IdCategoryReport, c.IdTypeBook });

            modelBuilder.Entity<DetailBookReceipt>()
                .HasKey(d => new { d.IdBookReceipt, d.IdBook });

            modelBuilder.Entity<CreateBook>()
                .HasKey(cb => new { cb.IdHeaderBook, cb.IdOuthor });
        }
    }
}
