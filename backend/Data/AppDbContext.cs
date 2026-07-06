using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
   public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

   public DbSet<Item> Items => Set<Item>();
   public DbSet<Customer> Customers => Set<Customer>();

}
