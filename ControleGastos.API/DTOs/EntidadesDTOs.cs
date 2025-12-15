using System.ComponentModel.DataAnnotations;
using ControleGastos.API.Models;

namespace ControleGastos.API.DTOs
{
    // ========== PESSOA DTOs ==========
    
    /// <summary>
    /// DTO para criar uma nova pessoa
    /// </summary>
    public class CriarPessoaDTO
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Idade é obrigatória")]
        [Range(0, 150, ErrorMessage = "Idade deve ser entre 0 e 150")]
        public int Idade { get; set; }
    }

    /// <summary>
    /// DTO para retornar dados de uma pessoa
    /// </summary>
    public class PessoaDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public bool EhMenorDeIdade { get; set; }
    }

    // ========== CATEGORIA DTOs ==========
    
    /// <summary>
    /// DTO para criar uma nova categoria
    /// </summary>
    public class CriarCategoriaDTO
    {
        [Required(ErrorMessage = "Descrição é obrigatória")]
        [MaxLength(100)]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "Finalidade é obrigatória")]
        public FinalidadeCategoria Finalidade { get; set; }
    }

    /// <summary>
    /// DTO para retornar dados de uma categoria
    /// </summary>
    public class CategoriaDTO
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
        public string FinalidadeTexto { get; set; } = string.Empty;
    }

    // ========== TRANSAÇÃO DTOs ==========
    
    /// <summary>
    /// DTO para criar uma nova transação
    /// </summary>
    public class CriarTransacaoDTO
    {
        [Required(ErrorMessage = "Descrição é obrigatória")]
        [MaxLength(200)]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "Valor é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser positivo")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "Tipo é obrigatório")]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória")]
        public int CategoriaId { get; set; }

        [Required(ErrorMessage = "Pessoa é obrigatória")]
        public int PessoaId { get; set; }
    }

    /// <summary>
    /// DTO para retornar dados de uma transação
    /// </summary>
    public class TransacaoDTO
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public string TipoTexto { get; set; } = string.Empty;
        public int CategoriaId { get; set; }
        public string CategoriaNome { get; set; } = string.Empty;
        public int PessoaId { get; set; }
        public string PessoaNome { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
    }

    // ========== CONSULTAS/RELATÓRIOS DTOs ==========
    
    /// <summary>
    /// DTO para retornar totais por pessoa
    /// </summary>
    public class TotalPorPessoaDTO
    {
        public int PessoaId { get; set; }
        public string PessoaNome { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }

    /// <summary>
    /// DTO para retornar totais por categoria
    /// </summary>
    public class TotalPorCategoriaDTO
    {
        public int CategoriaId { get; set; }
        public string CategoriaNome { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }

    /// <summary>
    /// DTO para retornar totais gerais
    /// </summary>
    public class TotaisGeraisDTO
    {
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }

    /// <summary>
    /// DTO para resposta completa de relatório por pessoa
    /// </summary>
    public class RelatorioPorPessoaDTO
    {
        public List<TotalPorPessoaDTO> TotaisPorPessoa { get; set; } = new();
        public TotaisGeraisDTO TotaisGerais { get; set; } = new();
    }

    /// <summary>
    /// DTO para resposta completa de relatório por categoria
    /// </summary>
    public class RelatorioPorCategoriaDTO
    {
        public List<TotalPorCategoriaDTO> TotaisPorCategoria { get; set; } = new();
        public TotaisGeraisDTO TotaisGerais { get; set; } = new();
    }
}