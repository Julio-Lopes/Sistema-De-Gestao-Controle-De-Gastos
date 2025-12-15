using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastos.API.Models
{
    /// <summary>
    /// Define os tipos de transação possíveis
    /// </summary>
    public enum TipoTransacao
    {
        /// <summary>
        /// Saída de dinheiro (gasto)
        /// </summary>
        Despesa = 1,

        /// <summary>
        /// Entrada de dinheiro (ganho)
        /// </summary>
        Receita = 2
    }

    /// <summary>
    /// Representa uma transação financeira (receita ou despesa)
    /// </summary>
    [Table("transacoes")]
    public class Transacao
    {
        /// <summary>
        /// Identificador único (gerado automaticamente)
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }

        /// <summary>
        /// Descrição da transação (ex: "Compra no supermercado", "Salário mensal")
        /// </summary>
        [Required(ErrorMessage = "Descrição é obrigatória")]
        [Column("descricao")]
        [MaxLength(200)]
        public string Descricao { get; set; } = string.Empty;

        /// <summary>
        /// Valor da transação (sempre positivo)
        /// </summary>
        [Required]
        [Column("valor", TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser positivo")]
        public decimal Valor { get; set; }

        /// <summary>
        /// Tipo da transação: Despesa ou Receita
        /// </summary>
        [Required]
        [Column("tipo")]
        public TipoTransacao Tipo { get; set; }

        /// <summary>
        /// ID da categoria associada
        /// </summary>
        [Required]
        [Column("categoria_id")]
        public int CategoriaId { get; set; }

        /// <summary>
        /// Navegação para a categoria
        /// </summary>
        [ForeignKey("CategoriaId")]
        public Categoria Categoria { get; set; } = null!;

        /// <summary>
        /// ID da pessoa associada
        /// </summary>
        [Required]
        [Column("pessoa_id")]
        public int PessoaId { get; set; }

        /// <summary>
        /// Navegação para a pessoa
        /// </summary>
        [ForeignKey("PessoaId")]
        public Pessoa Pessoa { get; set; } = null!;

        /// <summary>
        /// Data de criação da transação
        /// </summary>
        [Column("data_criacao")]
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}