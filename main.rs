#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate serde_derive;
extern crate rocket_contrib;
use rand::{Rng};
use rocket_contrib::json::Json;
use rocket::{response::{NamedFile, status}, http::{Status, Method, uri::Error}, request::Form, Rocket};
use rocket_cors::{Cors, CorsOptions, AllowedOrigins};
use std::{path::PathBuf, io::Cursor, mem::discriminant, string};
use std::io;
#[macro_use]
extern crate diesel;
extern crate dotenv;
use serde::Deserialize;

use diesel::{prelude::*, connection};
use dotenv::dotenv;
use std::env;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}
#[derive(Serialize)]
struct Food {
    name: String,
    calories: u32,
}
#[derive(Queryable, Serialize, Clone)]
pub struct Country {
    pub id: i32,
    pub name: String,
    pub capital: String,
}
table! {
    countries (id) {
        id -> Int4,
        name -> Varchar,
        capital -> Varchar,
    }
}
#[derive(Queryable,Deserialize, Serialize, Clone,FromForm,Debug, Insertable)]
pub struct  User{
    pub email:String,
    pub password:String
}
table! {
    users (id) {
        id -> Int4,
        email -> Varchar,
        password -> Varchar,
    }
}

use diesel::pg::PgConnection;
use self::countries::dsl::countries as all_countries;
fn get_countries(conn: &mut PgConnection) -> QueryResult<Vec<Country>> {
    all_countries.load::<Country>(conn)
}
#[get("/countries")]
fn countries() -> Json<Vec<Country>> {
    let mut  connection = establish_connection();
    let countries = get_countries(&mut connection).expect("Error loading countries");

    Json(countries)
}
#[post("/storeuser", format = "json", data = "<user>")]
fn storeuser(user: Json<User>) -> Result<Json<User>, Status> {
    let mut conn = establish_connection();
    let usr= user.clone();
    diesel::insert_into(users::table)
        .values(user.into_inner()   )
        .execute(&mut conn)
        .map_err(|_| Status::InternalServerError)?;

    Ok(Json(usr))
}
#[get("/checkusername?<username>&<password>")]
fn get_first_name(username: String, password:String) -> Result<Json<String>, Status> {
    let mut  connection=establish_connection();
    let first_name: Result<String, _> = users::table
    .filter(users::email.eq(username.clone()))
    .filter(users::password.eq(password))
        .order(users::id)
        .select(users::email)  // Assuming there is a 'name' column in your 'users' table
        .first(&mut connection);
    match first_name {
        Ok(name) => Ok(Json(name)),
        Err(e) => Err(Status::NotFound),
        }
}
#[get("/random")]
fn random() -> Result<Json<Country>, Status> {
    let mut connection = establish_connection();
    let countries = match get_countries(&mut connection) {
        Ok(countries) => countries,
        Err(_) => return Err(Status::InternalServerError),
    };

    let mut rng = rand::thread_rng();
    let random_index = rng.gen_range(0..countries.len());

    Ok(Json(countries[random_index].clone()))
}


#[get("/foods")]
fn foods() -> Json<Vec<Food>> {
    Json(vec![
        Food { name: "Apple".to_string(), calories: 52 },
        Food { name: "Banana".to_string(), calories: 96 },
        Food { name: "Potato".to_string(), calories: 77 },
        // Add more foods here...
    ])
}


#[get("/sound")]
fn sound() -> io::Result<NamedFile> {
    NamedFile::open(PathBuf::from("src/hello.mp3")) 
}
fn main() {
// Assuming your schema file is in the src directory



    establish_connection();
    let cors = rocket_cors::CorsOptions::default()
        .to_cors()
        .expect("error while creating CORS");
    rocket::ignite()
    .mount("/", routes![sound,countries,random,storeuser,foods,get_first_name])
    .attach(CORS)
    .launch();
}
use rocket::http::Header;
use rocket::{Request, Response};
use rocket::fairing::{Fairing, Info, Kind};

pub struct CORS;

impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    fn on_response(&self, request: &Request, response: &mut Response) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));

        // Check if it's an OPTIONS request and respond accordingly
        if request.method() == Method::Options {
            response.set_status(Status::Ok);
            response.set_sized_body(Cursor::new(Vec::new()));
        }
    }
}

