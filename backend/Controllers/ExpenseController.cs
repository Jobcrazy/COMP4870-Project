using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using backend.Models;
using backend.Data;
using backend.Common;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowCORS")]
public class ExpenseController
{
    private readonly ApplicationDbContext _context;

    public ExpenseController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Route("list")]
    public Response<IEnumerable<Expense>> getList(
        [FromQuery] String token,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        Response<IEnumerable<Expense>> response = new Response<IEnumerable<Expense>>
        {
            code = CODE.ERROR_SUCCESS,
            message = "",
        };

        if (!Utils.IsTokenValid(_context, token))
        {
            response.code = CODE.ERROR_INVALIDE_TOKEN;
            response.message = "Invalide Token";
            return response;
        }

        // Get a user
        var user = _context.User!.SingleOrDefault(u => u.gid == token);

        // Get expenses
        response.data = _context.Expense!
            .Where(e => e.uid == user!.id && e.date >= startDate && e.date <= endDate)
            .OrderByDescending(e => e.id);

        return response;
    }

    [HttpPost]
    [Route("add")]
    public Response<IEnumerable<Expense>> Add(
        [FromQuery] String token,
        [FromBody] Expense expense)
    {
        Response<IEnumerable<Expense>> response = new Response<IEnumerable<Expense>>
        {
            code = CODE.ERROR_SUCCESS,
            message = "",
        };

        if (!Utils.IsTokenValid(_context, token))
        {
            response.code = CODE.ERROR_INVALIDE_TOKEN;
            response.message = "Invalide Token";
            return response;
        }

        // Get a user
        var user = _context.User!.SingleOrDefault(u => u.gid == token);

        // Add an expense
        expense.uid = user!.id;

        // Save to database
        _context.Expense!.Add(expense);
        _context.SaveChanges();

        return response;
    }

    [HttpPost]
    [Route("del")]
    public Response<IEnumerable<Expense>> DelGoal([FromQuery] string token, [FromQuery] int id)
    {
        Response<IEnumerable<Expense>> response = new Response<IEnumerable<Expense>>
        {
            code = CODE.ERROR_SUCCESS,
            message = "",
        };

        if (!Utils.IsTokenValid(_context, token))
        {
            response.code = CODE.ERROR_INVALIDE_TOKEN;
            response.message = "Invalide Token";
            return response;
        }

        // Check if the expense already exists
        var expense = _context.Expense!.SingleOrDefault(
            e => e.id == id);

        // If not exists
        if (null == expense)
        {
            return response;
        }

        // Save to database
        _context.Expense!.Remove(expense);
        _context.SaveChanges();

        return response;
    }
}
