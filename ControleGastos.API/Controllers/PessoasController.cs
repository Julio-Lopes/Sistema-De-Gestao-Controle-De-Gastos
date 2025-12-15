using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.API.Data;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;

namespace ControleGastos.API.Controllers
{
    /// <summary>
    /// Controller para gerenciar pessoas
    /// Todas as rotas requerem autenticação JWT
    /// </summary>
    [Authorize] // Exige que o usuário esteja autenticado
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET api/pessoas
        /// Lista todas as pessoas cadastradas
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PessoaDTO>>> ListarPessoas()
        {
            var pessoas = await _context.Pessoas
                .Select(p => new PessoaDTO
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Idade = p.Idade,
                    EhMenorDeIdade = p.Idade < 18
                })
                .ToListAsync();

            return Ok(pessoas);
        }

        /// <summary>
        /// GET api/pessoas/{id}
        /// Busca uma pessoa específica por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PessoaDTO>> BuscarPessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa == null)
            {
                return NotFound(new { message = "Pessoa não encontrada" });
            }

            return Ok(new PessoaDTO
            {
                Id = pessoa.Id,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade,
                EhMenorDeIdade = pessoa.EhMenorDeIdade
            });
        }

        /// <summary>
        /// POST api/pessoas
        /// Cria uma nova pessoa
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PessoaDTO>> CriarPessoa([FromBody] CriarPessoaDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var novaPessoa = new Pessoa
            {
                Nome = request.Nome,
                Idade = request.Idade
            };

            _context.Pessoas.Add(novaPessoa);
            await _context.SaveChangesAsync();

            var pessoaDTO = new PessoaDTO
            {
                Id = novaPessoa.Id,
                Nome = novaPessoa.Nome,
                Idade = novaPessoa.Idade,
                EhMenorDeIdade = novaPessoa.EhMenorDeIdade
            };

            // Retorna 201 Created com a localização do recurso criado
            return CreatedAtAction(nameof(BuscarPessoa), new { id = novaPessoa.Id }, pessoaDTO);
        }

        /// <summary>
        /// DELETE api/pessoas/{id}
        /// Deleta uma pessoa e todas suas transações
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletarPessoa(int id)
        {
            var pessoa = await _context.Pessoas
                .Include(p => p.Transacoes) // Incluir transações para contagem
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pessoa == null)
            {
                return NotFound(new { message = "Pessoa não encontrada" });
            }

            var quantidadeTransacoes = pessoa.Transacoes.Count;

            // Remove a pessoa 
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Pessoa deletada com sucesso",
                transacoesDeletadas = quantidadeTransacoes
            });
        }
    }
}