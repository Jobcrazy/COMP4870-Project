using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using backend.Models;
using backend.Data;
using backend.Common;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowCORS")]
public class CategoryController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Route("")]
    public Response<IEnumerable<Category>> getAllCategories(String token)
    {
        Response<IEnumerable<Category>> response = new Response<IEnumerable<Category>>
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

        // Get categories
        response.data = _context.Category!.Where(
            c => c.uid == user!.id).OrderBy(c => c.id);
        return response;
    }

    [HttpGet]
    [Route("{id}")]
    public Response<Category> getCategoryById(String token, int id)
    {
        Response<Category> response = new Response<Category>
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

        // Get category
        response.data = _context.Category!.Where(
            c => c.uid == user!.id && c.id == id).FirstOrDefault();
        return response;
    }

    [HttpPost]
    [Route("")]
    public Response<IEnumerable<Category>> AddCategory([FromQuery] string token, [FromBody] Category category)
    {
        Response<IEnumerable<Category>> response = new Response<IEnumerable<Category>>
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
        var preCategory = _context.Category!.SingleOrDefault(
            c => c.uid == user!.id && c.categoryName == category.categoryName);

        // If exists
        if (null != preCategory)
        {
            response.code = CODE.ERROR_CATEGORY_EXISTS;
            response.message = "The category has already existed.";
            return response;
        }

        // Add a goal
        category.uid = user!.id;

        // Save to database
        _context.Category!.Add(category);
        _context.SaveChanges();

        return response;
    }

    [HttpPut]
    [Route("{id}")]
    public Response<IEnumerable<Category>> UpdateCategory([FromQuery] string token, [FromBody] Category category, int id)
    {
        Response<IEnumerable<Category>> response = new Response<IEnumerable<Category>>
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

        if (id != category.id) {
            response.code = CODE.ERROR_INVALID_ID;
            response.message = "ID doesn't match";
            return response;
        }

        // Get a user
        var user = _context.User!.SingleOrDefault(u => u.gid == token);

        // Check if the category already exists
        var preCategory = _context.Category!.SingleOrDefault(
            c => c.uid == user!.id && c.id == id);

        // If doesn't exists
        if (null == preCategory)
        {
            response.code = CODE.ERROR_CATEGORY_EXISTS;
            response.message = "The category doesn't exist.";
            return response;
        }

        // Update a category
        preCategory!.categoryName = category!.categoryName;

        // Save to database
        _context.Category!.Update(preCategory);
        _context.SaveChanges();

        return response;
    }

    [HttpDelete]
    [Route("{id}")]
    public Response<IEnumerable<Category>> DeleteCategory([FromQuery] string token, int id)
    {
        Response<IEnumerable<Category>> response = new Response<IEnumerable<Category>>
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

        // Check if category is in used
        var expenseRecord = _context.Expense!.Where(e => e.uid == user!.id && e.cid == id).FirstOrDefault();
        if (expenseRecord != null) {
            response.code = CODE.ERROR_CATEGORY_IN_USED;
            response.message = "Category is using, so this are not allowed to be deleted";
            return response;
        }

        // Check if the goal already exists
        var category = _context.Category!.SingleOrDefault(
            c => c.id == id);

        // If not exists
        if (null == category)
        {
            return response;
        }

        // Save to database
        _context.Category!.Remove(category);
        _context.SaveChanges();

        return response;
    }
}