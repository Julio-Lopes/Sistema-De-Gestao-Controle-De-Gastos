using Microsoft.EntityFrameworkCore;
using ControleGastos.API.Models;

namespace ControleGastos.API.Data
{
    /// <summary>
    /// Contexto do banco de dados usando Entity Framework Core
    /// Gerencia todas as entidades e configurações do banco
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets representam as tabelas no banco de dados
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        /// <summary>
        /// Configura as relações e regras do banco de dados
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== CONFIGURAÇÃO DA TABELA USUARIOS =====
            modelBuilder.Entity<Usuario>(entity =>
            {
                // Índice único para email 
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // ===== CONFIGURAÇÃO DA TABELA PESSOAS =====
            modelBuilder.Entity<Pessoa>(entity =>
            {
                // Quando deletar uma pessoa, deletar todas suas transações 
                entity.HasMany(p => p.Transacoes)
                    .WithOne(t => t.Pessoa)
                    .HasForeignKey(t => t.PessoaId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ===== CONFIGURAÇÃO DA TABELA CATEGORIAS =====
            modelBuilder.Entity<Categoria>(entity =>
            {
                // Não permitir deletar categoria se houver transações usando ela
                entity.HasMany(c => c.Transacoes)
                    .WithOne(t => t.Categoria)
                    .HasForeignKey(t => t.CategoriaId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Converter enum para inteiro no banco
                entity.Property(c => c.Finalidade)
                    .HasConversion<int>();
            });

            // ===== CONFIGURAÇÃO DA TABELA TRANSACOES =====
            modelBuilder.Entity<Transacao>(entity =>
            {
                // Converter enum para inteiro no banco
                entity.Property(t => t.Tipo)
                    .HasConversion<int>();

                // Configurar precisão decimal para valores monetários
                entity.Property(t => t.Valor)
                    .HasPrecision(18, 2);
            });

            // ===== DADOS INICIAIS =====
            // Categorias padrão para facilitar os testes
            modelBuilder.Entity<Categoria>().HasData(
                new Categoria { Id = 1, Descricao = "Alimentação", Finalidade = FinalidadeCategoria.Despesa },
                new Categoria { Id = 2, Descricao = "Transporte", Finalidade = FinalidadeCategoria.Despesa },
                new Categoria { Id = 3, Descricao = "Salário", Finalidade = FinalidadeCategoria.Receita },
                new Categoria { Id = 4, Descricao = "Investimentos", Finalidade = FinalidadeCategoria.Ambas },
                new Categoria { Id = 5, Descricao = "Lazer", Finalidade = FinalidadeCategoria.Despesa }
            );
        }
    }
}