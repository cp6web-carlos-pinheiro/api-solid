using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VideoGameCharacters.Api.Models;
using VideoGameCharacters.Api.Services;

namespace VideoGameCharacters.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VideoGameCharactersController(IVideoGameCharacterService service) : ControllerBase
{ 
    [HttpGet]
    public async Task<ActionResult<List<Character>>> GetCharacters()
        => Ok(await service.GetAllCharactersAsync());

    [HttpGet ("{id}")]
    public async Task<ActionResult<Character>> GetCharacter(int id)
    {
        var character = await service.GetCharacterByIdAsync(id);
        return character is not null ? Ok(character) : NotFound("Character not found");
    }
}