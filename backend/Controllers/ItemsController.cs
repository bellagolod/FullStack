using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
   private readonly AppDbContext _db;

   public ItemsController(AppDbContext db) => _db = db;

   [HttpGet]
   public async Task<List<Item>> GetAll() => await _db.Items.ToListAsync();

   [HttpPost]
   public async Task<Item> Create(Item item)
   {
      _db.Items.Add(item);
      await _db.SaveChangesAsync();
      return item;
   }
}
