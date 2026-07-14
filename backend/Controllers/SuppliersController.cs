using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuppliersController : ControllerBase
{
   private readonly AppDbContext _db;

   public SuppliersController(AppDbContext db) => _db = db;

   [HttpGet]
   public async Task<List<Supplier>> GetAll() => await _db.Suppliers.ToListAsync();

   [HttpGet("{id}")]
   public async Task<ActionResult<Supplier>> GetById(int id)
   {
      var supplier = await _db.Suppliers.FindAsync(id);
      return supplier is null ? NotFound() : supplier;
   }

   [HttpPost]
   public async Task<ActionResult<Supplier>> Create(Supplier supplier)
   {
      _db.Suppliers.Add(supplier);
      await _db.SaveChangesAsync();
      return CreatedAtAction(nameof(GetById), new { id = supplier.Id }, supplier);
   }

   [HttpPut("{id}")]
   public async Task<ActionResult<Supplier>> Update(int id, Supplier input)
   {
      var supplier = await _db.Suppliers.FindAsync(id);
      if (supplier is null) return NotFound();

      supplier.Name = input.Name;
      supplier.ContactPerson = input.ContactPerson;
      supplier.Phone = input.Phone;
      supplier.IsActive = input.IsActive;

      await _db.SaveChangesAsync();
      return supplier;
   }

   [HttpDelete("{id}")]
   public async Task<IActionResult> Delete(int id)
   {
      var supplier = await _db.Suppliers.FindAsync(id);
      if (supplier is null) return NotFound();

      _db.Suppliers.Remove(supplier);
      await _db.SaveChangesAsync();
      return NoContent();
   }
}
