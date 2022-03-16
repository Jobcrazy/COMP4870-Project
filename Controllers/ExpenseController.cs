using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using backend.Models;
using backend.Data;
using backend.Common;
using Microsoft.EntityFrameworkCore;

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

    [HttpGet]
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
            .Include(e => e.category)
            .Where(e => e.uid == user!.id /*&& e.date >= startDate && e.date <= endDate*/)
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

    [HttpDelete]
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

    [HttpPut]
    [Route("{id}")]
    public Response<IEnumerable<Expense>> UpdateExpensey(
        [FromQuery] string token,
        [FromQuery] int id,
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
            response.message = "Invalid Token";
            return response;
        }

        // Get a user
        var user = _context.User!.SingleOrDefault(u => u.gid == token);

        // Check if the category already exists
        var preExpense = _context.Expense!.SingleOrDefault(
            c => c.uid == user!.id && c.id == id);

        // If doesn't exists
        if (null == preExpense)
        {
            response.code = CODE.ERROR_CATEGORY_EXISTS;
            response.message = "The expense doesn't exist.";
            return response;
        }

        // Update an expense
        preExpense.amount = expense.amount;
        preExpense.cid = expense.cid;
        preExpense.note = expense.note;
        preExpense.date = expense.date;

        // Save to database
        _context.Expense!.Update(preExpense);
        _context.SaveChanges();

        return response;
    }

    [HttpGet]
    [Route("monthly")]
    public Response<IEnumerable<Expense>> getMonthly(
        [FromQuery] String token)
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

        // Get monthly expenses
        response.data = _context.Expense!
                        .Select(e => new
                        {
                            e.uid,
                            e.amount,
                            e.date.Year,
                            e.date.Month
                        })
                        .Where(e => e.uid == user!.id)
                        .GroupBy(x => new { x.Year, x.Month }, (key, group) =>
                                 new Expense
                                 {
                                     note = "" + key.Year + "-" + key.Month,
                                     amount = group.Sum(k => k.amount)
                                 }
                        ).ToList();

        return response;
    }

    [HttpGet]
    [Route("category")]
    public Response<IEnumerable<Expense>> getCategory(
        [FromQuery] String token)
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

        // Get monthly expenses
        response.data = _context.Expense!
                        .Select(e => new
                        {
                            e.uid,
                            e.amount,
                            e.cid,
                            e.category
                        })
                        .Where(e => e.uid == user!.id)
                        .GroupBy(x => new { x.category!.id, x.category!.categoryName }, (key, group) =>
                                 new Expense
                                 {
                                     note = key.categoryName,
                                     amount = group.Sum(k => k.amount)
                                 }
                        ).ToList();

        return response;
    }
}
