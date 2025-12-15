using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.API.Data;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;

namespace ControleGastos.API.Controllers
{
    /// <summary>
    /// Controller para gerenciar transações financeiras
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET api/transacoes
        /// Lista todas as transações com informações de pessoa e categoria
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransacaoDTO>>> ListarTransacoes()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)    // Carregar dados da pessoa
                .Include(t => t.Categoria) // Carregar dados da categoria
                .Select(t => new TransacaoDTO
                {
                    Id = t.Id,
                    Descricao = t.Descricao,
                    Valor = t.Valor,
                    Tipo = t.Tipo,
                    TipoTexto = t.Tipo.ToString(),
                    CategoriaId = t.CategoriaId,
                    CategoriaNome = t.Categoria.Descricao,
                    PessoaId = t.PessoaId,
                    PessoaNome = t.Pessoa.Nome,
                    DataCriacao = t.DataCriacao
                })
                .OrderByDescending(t => t.DataCriacao) // Mais recentes primeiro
                .ToListAsync();

            return Ok(transacoes);
        }

        /// <summary>
        /// GET api/transacoes/{id}
        /// Busca uma transação específica por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<TransacaoDTO>> BuscarTransacao(int id)
        {
            var transacao = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transacao == null)
            {
                return NotFound(new { message = "Transação não encontrada" });
            }

            return Ok(new TransacaoDTO
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                TipoTexto = transacao.Tipo.ToString(),
                CategoriaId = transacao.CategoriaId,
                CategoriaNome = transacao.Categoria.Descricao,
                PessoaId = transacao.PessoaId,
                PessoaNome = transacao.Pessoa.Nome,
                DataCriacao = transacao.DataCriacao
            });
        }

        /// <summary>
        /// POST api/transacoes
        /// Cria uma nova transação com validações de regras de negócio
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<TransacaoDTO>> CriarTransacao([FromBody] CriarTransacaoDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // VALIDAÇÃO 1: Verificar se a pessoa existe
            var pessoa = await _context.Pessoas.FindAsync(request.PessoaId);
            if (pessoa == null)
            {
                return BadRequest(new { message = "Pessoa não encontrada" });
            }

            // VALIDAÇÃO 2: Verificar se a categoria existe
            var categoria = await _context.Categorias.FindAsync(request.CategoriaId);
            if (categoria == null)
            {
                return BadRequest(new { message = "Categoria não encontrada" });
            }

            // VALIDAÇÃO 3: Menores de idade (< 18 anos) só podem ter DESPESAS
            if (pessoa.EhMenorDeIdade && request.Tipo == TipoTransacao.Receita)
            {
                return BadRequest(new 
                { 
                    message = "Menores de idade não podem ter receitas",
                    pessoaNome = pessoa.Nome,
                    pessoaIdade = pessoa.Idade
                });
            }

            // VALIDAÇÃO 4: Verificar se a categoria aceita o tipo de transação
            // Ex: Categoria "Salário" (finalidade Receita) não pode ser usada em Despesa
            if (!categoria.AceitaTipoTransacao(request.Tipo))
            {
                return BadRequest(new 
                { 
                    message = $"Categoria '{categoria.Descricao}' não aceita transações do tipo '{request.Tipo}'",
                    categoriaFinalidade = categoria.Finalidade.ToString(),
                    tipoTransacao = request.Tipo.ToString()
                });
            }

            // Criar a transação
            var novaTransacao = new Transacao
            {
                Descricao = request.Descricao,
                Valor = request.Valor,
                Tipo = request.Tipo,
                CategoriaId = request.CategoriaId,
                PessoaId = request.PessoaId,
                DataCriacao = DateTime.UtcNow
            };

            _context.Transacoes.Add(novaTransacao);
            await _context.SaveChangesAsync();

            // Recarregar a transação com pessoa e categoria para retornar dados completos
            var transacaoCriada = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .FirstAsync(t => t.Id == novaTransacao.Id);

            var transacaoDTO = new TransacaoDTO
            {
                Id = transacaoCriada.Id,
                Descricao = transacaoCriada.Descricao,
                Valor = transacaoCriada.Valor,
                Tipo = transacaoCriada.Tipo,
                TipoTexto = transacaoCriada.Tipo.ToString(),
                CategoriaId = transacaoCriada.CategoriaId,
                CategoriaNome = transacaoCriada.Categoria.Descricao,
                PessoaId = transacaoCriada.PessoaId,
                PessoaNome = transacaoCriada.Pessoa.Nome,
                DataCriacao = transacaoCriada.DataCriacao
            };

            return CreatedAtAction(nameof(BuscarTransacao), new { id = transacaoCriada.Id }, transacaoDTO);
        }
    }
}