using VideoGameCharacters.Api.Models;

namespace VideoGameCharacters.Api.Services;

public class VideoGameCharacterService: IVideoGameCharacterService
{
    static List<Character> characters = new List<Character>
    {
        new Character { Id = 1, Name = "Mario", Game = "Super Mario Bros.", Role = "Plumber" },
        new Character { Id = 2, Name = "Link", Game = "The Legend of Zelda", Role = "Hero" },
        new Character { Id = 3, Name = "Master Chief", Game = "Halo", Role = "Spartan" }
    };

    public async Task<List<Character>> GetAllCharactersAsync()
        => await Task.FromResult(characters);

    public async Task<Character> GetCharacterByIdAsync(int id)
    {
        var character = characters.FirstOrDefault(c => c.Id == id);
        if (character == null)
        {
            throw new KeyNotFoundException($"Character with Id {id} not found.");
        }
        return await Task.FromResult(character);
    }

    public async Task<Character> AddCharacterAsync(Character character)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> UpdateCharacterAsync(int id, Character character)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteCharacterAsync(int id)
    {
        throw new NotImplementedException();
    }
}