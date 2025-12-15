using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastos.API.Models
{
    /// <summary>
    /// Define as finalidades possíveis de uma categoria
    /// </summary>
    public enum FinalidadeCategoria
    {
        /// <summary>
        /// Categoria apenas para despesas
        /// </summary>
        Despesa = 1,

        /// <summary>
        /// Categoria apenas para receitas
        /// </summary>
        Receita = 2,

        /// <summary>
        /// Categoria que aceita tanto despesas quanto receitas
        /// </summary>
        Ambas = 3
    }

    /// <summary>
    /// Representa uma categoria para classificar transações
    /// </summary>
    [Table("categorias")]
    public class Categoria
    {
        /// <summary>
        /// Identificador único (gerado automaticamente)
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }

        /// <summary>
        /// Descrição da categoria (ex: Alimentação, Salário, Transporte)
        /// </summary>
        [Required(ErrorMessage = "Descrição é obrigatória")]
        [Column("descricao")]
        [MaxLength(100)]
        public string Descricao { get; set; } = string.Empty;

        /// <summary>
        /// Define se a categoria é para despesa, receita ou ambas
        /// Usado para validar transações
        /// </summary>
        [Required]
        [Column("finalidade")]
        public FinalidadeCategoria Finalidade { get; set; }

        /// <summary>
        /// Lista de transações que usam esta categoria
        /// </summary>
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

        /// <summary>
        /// Verifica se a categoria aceita o tipo de transação informado
        /// </summary>
        /// <param name="tipoTransacao">Tipo da transação (Despesa ou Receita)</param>
        /// <returns>True se a categoria aceita esse tipo</returns>
        public bool AceitaTipoTransacao(TipoTransacao tipoTransacao)
        {
            return Finalidade == FinalidadeCategoria.Ambas ||
                   (Finalidade == FinalidadeCategoria.Despesa && tipoTransacao == TipoTransacao.Despesa) ||
                   (Finalidade == FinalidadeCategoria.Receita && tipoTransacao == TipoTransacao.Receita);
        }
    }
}