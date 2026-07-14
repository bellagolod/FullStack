using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
   private readonly AppDbContext _db;

   public CustomersController(AppDbContext db) => _db = db;

   [HttpGet]
   public async Task<List<Customer>> GetAll() => await _db.Customers.ToListAsync();

   [HttpGet("{id}")]
   public async Task<ActionResult<Customer>> GetById(int id)
   {
      var customer = await _db.Customers.FindAsync(id);
      return customer is null ? NotFound() : customer;
   }

   [HttpPost]
   public async Task<Customer> Create(Customer customer)
   {
      _db.Customers.Add(customer);
      await _db.SaveChangesAsync();
      return customer;
   }

   [HttpPut("{id}")]
   public async Task<IActionResult> Update(int id, Customer customer)
   {
      if (id != customer.Id) return BadRequest();
      _db.Entry(customer).State = EntityState.Modified;
      await _db.SaveChangesAsync();
      return NoContent();
   }

   [HttpDelete("{id}")]
   public async Task<IActionResult> Delete(int id)
   {
      var customer = await _db.Customers.FindAsync(id);
      if (customer is null) return NotFound();
      _db.Customers.Remove(customer);
      await _db.SaveChangesAsync();
      return NoContent();
   }
}
