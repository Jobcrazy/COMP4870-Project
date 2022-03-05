using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using backend.Models;
using backend.Data;
using backend.Common;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowCORS")]
public class GoalController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GoalController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Route("all")]
    public Response<IEnumerable<Goal>> All(String token)
    {
        Response<IEnumerable<Goal>> response = new Response<IEnumerable<Goal>>
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

        // Get goals
        response.data = _context.Goal!.Where(
            g => g.uid == user!.id).OrderByDescending(g => g.date);
        return response;
    }

    [HttpPost]
    [Route("add")]
    public Response<IEnumerable<Goal>> AddGoal([FromQuery] string token, [FromBody] Goal goal)
    {
        Response<IEnumerable<Goal>> response = new Response<IEnumerable<Goal>>
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

        // Check if the goal already exists
        var preGoal = _context.Goal!.SingleOrDefault(
            g => g.uid == user!.id && g.date == goal.date);

        // If exists
        if (null != preGoal)
        {
            response.code = CODE.ERROR_GOAL_EXISTS;
            response.message = "The budget has already existed.";
            return response;
        }

        // Add a goal
        goal.uid = user!.id;

        // Save to database
        _context.Goal!.Add(goal);
        _context.SaveChanges();

        return response;
    }

    [HttpPost]
    [Route("update")]
    public Response<IEnumerable<Goal>> UpdateGoal([FromQuery] string token, [FromBody] Goal goal)
    {
        Response<IEnumerable<Goal>> response = new Response<IEnumerable<Goal>>
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

        // Check if the goal already exists
        var preGoal = _context.Goal!.SingleOrDefault(
            g => g.uid == user!.id && g.date == goal.date);

        // If doesn't exists
        if (null == preGoal)
        {
            response.code = CODE.ERROR_GOAL_EXISTS;
            response.message = "The budget doesn't exist.";
            return response;
        }

        // Update a goal
        preGoal!.amount = goal!.amount;

        // Save to database
        _context.Goal!.Update(preGoal);
        _context.SaveChanges();

        return response;
    }

    [HttpPost]
    [Route("del")]
    public Response<IEnumerable<Goal>> DelGoal([FromQuery] string token, [FromQuery] int id)
    {
        Response<IEnumerable<Goal>> response = new Response<IEnumerable<Goal>>
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

        // Check if the goal already exists
        var goal = _context.Goal!.SingleOrDefault(
            g => g.id == id);

        // If not exists
        if (null == goal)
        {
            return response;
        }

        // Save to database
        _context.Goal!.Remove(goal);
        _context.SaveChanges();

        return response;
    }
}