import json
import sys
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import pickle
from collections import defaultdict

new_user = dict()

data = json.load(sys.stdin)
# data = {"occupation":"student","age":21,"gender":"male"}

#loading the data
users_df = pd.read_csv("./data/user_data.csv")
users_df = users_df.drop(["Unnamed: 0"],axis=1)
movies_df = pd.read_csv("./data/ratings_and_movies.csv")

for col in users_df.columns.values:
    new_user[col] = 0

#adding to the age group
data['age'] = int(data['age'])

if 4 < data['age'] < 13:
    new_user['Group_Kid'] = 1

elif 13 < data['age'] < 20:
    new_user["Group_Teen"] = 1

else:
    new_user["Group_Adult"] = 1

#setting the occupation
new_user["Occupation_"+data['occupation']]=1

#setting the gender
if(data['gender']=='male'):
    new_user['Gender_M'] = 1 
else:
    new_user["Gender_F"] = 1

#adding to the matrix
users_df = users_df.append(new_user,ignore_index=True)

#creating the relationship matrix
relation_matrix = pd.DataFrame(cosine_similarity(users_df),columns= ["user"+str(i) for i in range(len(users_df))])
new_user_results = relation_matrix.loc[len(relation_matrix)-1].values

#loading the communities
with open("./data/communityresults.pkl","rb") as f:
    comm_count = pickle.load(f)


#checking the avg for every community and adding it to one
avg_per_comm = []*len(comm_count)
max_avg = 0
chosen_one = None

for comm in comm_count:
  sum = 0
  for user in comm_count[comm]:
    sum = sum + new_user_results[int(user[4:])-1]

  avg = sum / len(comm_count[comm])

  if avg > max_avg:
    chosen_one = comm
    max_avg = avg

def extract(n):
  return int(n[4:])
  
#getting the user ids from the communities
user_ids = list(map(extract,comm_count[chosen_one]))
list_df = movies_df[movies_df['user_id'].isin(user_ids)]
list_df = list_df.drop(['movie_id','timestamp','timestamp','video_release date'],axis=1)

#filtering top 10 movies based on popularity and rating
by_movies = list_df.groupby(['movie_title','IMDb_URL'])
by_rating = by_movies.mean().sort_values('rating',ascending=False).head(10)
by_popularity = by_movies.sum().sort_values('user_id',ascending=False).head(10)

# helper method
def create_clean_dict(df):
    df = df.drop(['Unnamed: 0','user_id','rating'],axis=1)
    df_dict = df.to_dict('index')
    movie_list = []

    for item in df_dict:
        movie_dict = dict()
        movie_dict['name'],movie_dict['link'] = item
        movie_dict['genre']=[]
        for more_item in df_dict[item]:
            if(df_dict[item][more_item]!=0.0 or df_dict[item][more_item]!=0):
                movie_dict['genre'].append(more_item)
        
        movie_list.append(movie_dict)

    return movie_list

#getting the dictionaries for popular and rated movies
by_ratings_dict = create_clean_dict(by_rating)
by_popularity_dict = create_clean_dict(by_popularity)

#returning the data to the nodejs
result = {"rating":by_ratings_dict,"popularity":by_popularity_dict}
print(json.dumps(result))