using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.API.Data;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;

namespace ControleGastos.API.Controllers
{
    /// <summary>
    /// Controller para gerenciar categorias de transações
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET api/categorias
        /// Lista todas as categorias cadastradas
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaDTO>>> ListarCategorias()
        {
            var categorias = await _context.Categorias
                .Select(c => new CategoriaDTO
                {
                    Id = c.Id,
                    Descricao = c.Descricao,
                    Finalidade = c.Finalidade,
                    FinalidadeTexto = c.Finalidade.ToString()
                })
                .ToListAsync();

            return Ok(categorias);
        }

        /// <summary>
        /// GET api/categorias/{id}
        /// Busca uma categoria específica por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaDTO>> BuscarCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound(new { message = "Categoria não encontrada" });
            }

            return Ok(new CategoriaDTO
            {
                Id = categoria.Id,
                Descricao = categoria.Descricao,
                Finalidade = categoria.Finalidade,
                FinalidadeTexto = categoria.Finalidade.ToString()
            });
        }

        /// <summary>
        /// POST api/categorias
        /// Cria uma nova categoria
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CategoriaDTO>> CriarCategoria([FromBody] CriarCategoriaDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var novaCategoria = new Categoria
            {
                Descricao = request.Descricao,
                Finalidade = request.Finalidade
            };

            _context.Categorias.Add(novaCategoria);
            await _context.SaveChangesAsync();

            var categoriaDTO = new CategoriaDTO
            {
                Id = novaCategoria.Id,
                Descricao = novaCategoria.Descricao,
                Finalidade = novaCategoria.Finalidade,
                FinalidadeTexto = novaCategoria.Finalidade.ToString()
            };

            return CreatedAtAction(nameof(BuscarCategoria), new { id = novaCategoria.Id }, categoriaDTO);
        }
    }
}