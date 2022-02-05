using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using backend.Models;
using backend.Data;
using backend.Common;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowCORS")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Route("login")]
    public Response<string> Login(User user)
    {
        var respond = new Response<string>
        {
            code = 0,
            message = "",
        };

        var existingUser = _context.User!.SingleOrDefault(u => u.gid == user.gid);

        if (null == existingUser)
        {
            // The user doesn't exist, save this user
            _context.User!.Add(user);
            _context.SaveChanges();
        }
        else
        {
            existingUser.gname = user.gname;
            existingUser.fname = user.fname;
            existingUser.head = user.head;
            existingUser.xname = user.xname;
            _context.SaveChanges();
        }

        respond.data = user.gid;
        return respond;
    }
}
