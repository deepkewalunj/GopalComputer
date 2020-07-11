using Gopal.EntityFrameworkCore;
using Gopal.Middleware;
using Gopal.Models.Common;
using Gopal.Services.Accessory;
using Gopal.Services.Bill;
using Gopal.Services.Common;
using Gopal.Services.Customer;
using Gopal.Services.MaterialType;
using Gopal.Services.Outward;
using Gopal.Services.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Rotativa.AspNetCore;
using System.IO;
using System.Text;

namespace Gopal
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("Gopal_CORS", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));
            services.AddHttpContextAccessor();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Configuration["Jwt:Issuer"],
            ValidAudience = Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
        };
    });
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddDbContext<gopal_dbContext>(options => options.UseSqlServer(Configuration["ConnectionString"]));
            services.AddTransient<IUserServices, UserService>();
            services.AddTransient<ICustomerServices, CustomerService>();
            services.AddTransient<IMaterialTypeServices, MaterialTypeService>();
            services.AddTransient<IInwardServices, InwardService>();
            services.AddTransient<IAccessoryServices, AccessoryService>();
            services.AddTransient<ITypeAheadService, TypeAheadService>();
            services.AddTransient<IBillServices, BillService>();
            services.AddTransient<IOutwardServices, OutwardService>();
            services.AddSingleton<ILog, LogNLog>();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist/deepak";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILog logger)
        {
            ConnectionHelper.SetConnectionString(Configuration["ConnectionString"]);
            app.UseCors("Gopal_CORS");

            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.ConfigureExceptionHandler(logger);

            app.UseHttpsRedirection();
            app.UseStaticFiles(); app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot/Uploads")),
                RequestPath = new PathString("/api/Uploads")
            });
            app.UseSpaStaticFiles();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
            RotativaConfiguration.Setup(env);
            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

               if (env.IsDevelopment())
               {
                   spa.UseAngularCliServer(npmScript: "start");
               }
            });
        }
    }
}
