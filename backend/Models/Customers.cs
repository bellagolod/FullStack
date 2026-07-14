namespace Backend.Models;

public class Customer
{
   public int Id { get; set; }
   public string Name { get; set; } = string.Empty;
   public string? City { get; set; }
   public string? Phone { get; set; }
   public bool IsActive { get; set; }
}
