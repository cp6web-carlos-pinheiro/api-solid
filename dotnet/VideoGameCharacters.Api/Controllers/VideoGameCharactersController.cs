using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VideoGameCharacters.Api.Models;

namespace VideoGameCharacters.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VideoGameCharactersController : ControllerBase
{ 

    static List<Character> characters = new List<Character>
    {
        new Character { Id = 1, Name = "Mario", Game = "Super Mario Bros.", Role = "Plumber" },
        new Character { Id = 2, Name = "Link", Game = "The Legend of Zelda", Role = "Hero" },
        new Character { Id = 3, Name = "Master Chief", Game = "Halo", Role = "Spartan" }
    };

    [HttpGet]
    public async Task<ActionResult<List<Character>>> GetCharacters()
        => await Task.FromResult(Ok(characters));
}