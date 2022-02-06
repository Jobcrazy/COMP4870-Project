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
    public Response<IEnumerable<Goal>> GetAll(string token)
    {
        Response<IEnumerable<Goal>> response = new Response<IEnumerable<Goal>>
        {
            code = CODE.ERROR_SUCCESS,
            message = "",
        };

        if (Utils.IsTokenValid(_context, token))
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
    public Response<IEnumerable<Goal>> AddGoal(string token, Goal goal)
    {
        Response<IEnumerable<Goal>> response = new Response<IEnumerable<Goal>>
        {
            code = CODE.ERROR_SUCCESS,
            message = "",
        };

        if (Utils.IsTokenValid(_context, token))
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
            response.message = "Duplicated Goal";
            return response;
        }

        // Add a goal
        goal.uid = user!.id;

        // Save to database
        _context.Goal!.Add(goal);
        _context.SaveChanges();

        return response;
    }
}