using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastos.API.Models
{
    /// <summary>
    /// Representa uma pessoa que possui transações financeiras
    /// </summary>
    [Table("pessoas")]
    public class Pessoa
    {
        /// <summary>
        /// Identificador único (gerado automaticamente)
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }

        /// <summary>
        /// Nome completo da pessoa
        /// </summary>
        [Required(ErrorMessage = "Nome é obrigatório")]
        [Column("nome")]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        /// <summary>
        /// Idade da pessoa (número inteiro positivo)
        /// Usado para validar se pode criar receitas (apenas maiores de 18)
        /// </summary>
        [Required(ErrorMessage = "Idade é obrigatória")]
        [Column("idade")]
        [Range(0, 150, ErrorMessage = "Idade deve ser entre 0 e 150")]
        public int Idade { get; set; }

        /// <summary>
        /// Lista de transações associadas a esta pessoa
        /// Quando a pessoa for deletada, todas as transações também serão (CASCADE)
        /// </summary>
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

        /// <summary>
        /// Verifica se a pessoa é menor de idade (menos de 18 anos)
        /// Menores só podem ter despesas
        /// </summary>
        [NotMapped]
        public bool EhMenorDeIdade => Idade < 18;
    }
}