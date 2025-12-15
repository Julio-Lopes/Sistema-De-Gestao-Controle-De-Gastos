using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.API.Data;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;

namespace ControleGastos.API.Controllers
{
    /// <summary>
    /// Controller para gerar relatórios e consultas de totais
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RelatoriosController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET api/relatorios/por-pessoa
        /// Retorna totais de receitas, despesas e saldo por pessoa + total geral
        /// </summary>
        [HttpGet("por-pessoa")]
        public async Task<ActionResult<RelatorioPorPessoaDTO>> ConsultaTotaisPorPessoa()
        {
            // Buscar todas as pessoas
            var pessoas = await _context.Pessoas.ToListAsync();

            var totaisPorPessoa = new List<TotalPorPessoaDTO>();

            // Para cada pessoa, calcular totais de receitas e despesas
            foreach (var pessoa in pessoas)
            {
                // Buscar todas as transações dessa pessoa
                var transacoes = await _context.Transacoes
                    .Where(t => t.PessoaId == pessoa.Id)
                    .ToListAsync();

                // Somar receitas (Tipo = Receita)
                var totalReceitas = transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                // Somar despesas (Tipo = Despesa)
                var totalDespesas = transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                // Calcular saldo (Receitas - Despesas)
                var saldo = totalReceitas - totalDespesas;

                totaisPorPessoa.Add(new TotalPorPessoaDTO
                {
                    PessoaId = pessoa.Id,
                    PessoaNome = pessoa.Nome,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = saldo
                });
            }

            // Calcular totais gerais (soma de todas as pessoas)
            var totaisGerais = new TotaisGeraisDTO
            {
                TotalReceitas = totaisPorPessoa.Sum(t => t.TotalReceitas),
                TotalDespesas = totaisPorPessoa.Sum(t => t.TotalDespesas),
                SaldoLiquido = totaisPorPessoa.Sum(t => t.Saldo)
            };

            return Ok(new RelatorioPorPessoaDTO
            {
                TotaisPorPessoa = totaisPorPessoa,
                TotaisGerais = totaisGerais
            });
        }

        /// <summary>
        /// GET api/relatorios/por-categoria
        /// Retorna totais de receitas, despesas e saldo por categoria + total geral
        /// </summary>
        [HttpGet("por-categoria")]
        public async Task<ActionResult<RelatorioPorCategoriaDTO>> ConsultaTotaisPorCategoria()
        {
            // Buscar todas as categorias
            var categorias = await _context.Categorias.ToListAsync();

            var totaisPorCategoria = new List<TotalPorCategoriaDTO>();

            // Para cada categoria, calcular totais
            foreach (var categoria in categorias)
            {
                // Buscar todas as transações dessa categoria
                var transacoes = await _context.Transacoes
                    .Where(t => t.CategoriaId == categoria.Id)
                    .ToListAsync();

                // Somar receitas
                var totalReceitas = transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                // Somar despesas
                var totalDespesas = transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                // Calcular saldo
                var saldo = totalReceitas - totalDespesas;

                totaisPorCategoria.Add(new TotalPorCategoriaDTO
                {
                    CategoriaId = categoria.Id,
                    CategoriaNome = categoria.Descricao,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = saldo
                });
            }

            // Calcular totais gerais
            var totaisGerais = new TotaisGeraisDTO
            {
                TotalReceitas = totaisPorCategoria.Sum(t => t.TotalReceitas),
                TotalDespesas = totaisPorCategoria.Sum(t => t.TotalDespesas),
                SaldoLiquido = totaisPorCategoria.Sum(t => t.Saldo)
            };

            return Ok(new RelatorioPorCategoriaDTO
            {
                TotaisPorCategoria = totaisPorCategoria,
                TotaisGerais = totaisGerais
            });
        }

        /// <summary>
        /// GET api/relatorios/resumo-geral
        /// Retorna um resumo geral do sistema
        /// </summary>
        [HttpGet("resumo-geral")]
        public async Task<ActionResult> ResumoGeral()
        {
            var totalPessoas = await _context.Pessoas.CountAsync();
            var totalCategorias = await _context.Categorias.CountAsync();
            var totalTransacoes = await _context.Transacoes.CountAsync();

            var todasTransacoes = await _context.Transacoes.ToListAsync();
            
            var totalReceitas = todasTransacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);
            
            var totalDespesas = todasTransacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            return Ok(new
            {
                quantidades = new
                {
                    pessoas = totalPessoas,
                    categorias = totalCategorias,
                    transacoes = totalTransacoes
                },
                financeiro = new
                {
                    totalReceitas,
                    totalDespesas,
                    saldoLiquido = totalReceitas - totalDespesas
                }
            });
        }
    }
}