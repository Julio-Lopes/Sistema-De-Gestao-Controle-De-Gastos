using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastos.API.Models
{
    /// <summary>
    /// Representa um usuário do sistema para autenticação
    /// </summary>
    [Table("usuarios")]
    public class Usuario
    {
        /// <summary>
        /// Identificador único do usuário (gerado automaticamente)
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }

        /// <summary>
        /// Email usado para login (deve ser único)
        /// </summary>
        [Required]
        [Column("email")]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Senha criptografada com hash
        /// </summary>
        [Required]
        [Column("senha_hash")]
        public string SenhaHash { get; set; } = string.Empty;

        /// <summary>
        /// Nome completo do usuário
        /// </summary>
        [Required]
        [Column("nome")]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        /// <summary>
        /// Data de criação do registro
        /// </summary>
        [Column("data_criacao")]
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}