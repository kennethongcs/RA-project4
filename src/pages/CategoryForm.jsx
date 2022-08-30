import React, { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import RenderBudgetInput from '../components/BudgetInput.jsx';

const CategoryForm = ({ workspace }) => {
  const [addCategory, setaddCategory] = useState([]);
  const [categoryBudgetList, setCategoryBudgetList] = useState([
    { id: 1, category: 'Transport', budget: 0 },
    { id: 2, category: 'Food', budget: 0 },
    { id: 3, category: 'Groceries', budget: 0 },
    { id: 4, category: 'Utilities', budget: 0 },
    { id: 5, category: 'Clothes', budget: 0 },
    { id: 6, category: 'Healthcare', budget: 0 },
    { id: 7, category: 'Insurance', budget: 0 },
    { id: 8, category: 'Donations', budget: 0 },
    { id: 9, category: 'Entertainment', budget: 0 },
  ]);

  const CardHeaderNoPadding = styled(CardHeader)(`
  padding-Top: 16;
  padding-Bottom: 0;
  &:last-child {
    padding-top: 0;
  }
`);

  const budgetUpdate = (newBudget, categoryName) => {
    // update budget in categoryBudgetList
    const index = categoryBudgetList.findIndex(
      (x) => x.category === categoryName,
    );
    const tempCategoryList = [...categoryBudgetList];
    tempCategoryList[index] = { category: categoryName, budget: newBudget };
    setCategoryBudgetList(tempCategoryList);
  };

  const handleAddCategory = () => {
    // get last id
    const lastId = categoryBudgetList.at(-1).id;

    // add new category to categoryBudgetList
    const updatedCategoryList = [
      ...categoryBudgetList,
      { id: (lastId + 1), category: addCategory, budget: 0 },
    ];
    // updates categoryBudgetList
    setCategoryBudgetList(updatedCategoryList);
    setaddCategory('');
  };

  const handleCategoryDelete = (element) => {
    // finds and delete category from categoryBudgetList
    const newCategoryList = categoryBudgetList.filter(
      (x) => x.category !== element.category,
    );
    // updates categoryBudgetList
    setCategoryBudgetList(newCategoryList);
  };

  const navigate = useNavigate();
  const handleCategoryListSubmit = () => {
    // add user Id

    axios
      .post('/add-category', {
        categoryBudgetList,
        workspaceId: workspace.id,
      })
      .then((response) => {
        console.log(response);
        navigate('/workspace/3');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {/* 'Create a New Expense Category' Title */}
      <Grid container>
        <Grid item xs={12} sm={8} md={5}>
          <Typography variant="h5">
            Create a New Expense Category
          </Typography>
        </Grid>
      </Grid>
      {/* Category Input Field */}
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: 80 }}
      >
        <TextField
          id="category-input"
          label="New Category"
          value={addCategory}
          onChange={(event) => {
            if (event.target.value.match(/^[a-zA-Z\s]*$/)) {
              setaddCategory(event.target.value);
            }
          }}
        />
      </Grid>
      {/* Add Category Button */}
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: 70 }}
      >
        <Button
          sx={{ minWidth: 140, minHeight: 40 }}
          onClick={handleAddCategory}
          variant="contained"
        >
          Add Category
        </Button>
      </Grid>
      {/* Categories shown */}
      <Box
        container
        sx={{ minHeight: 500 }}
        border={1}
        borderRadius={1}
        borderColor="lightGrey"
      >
        {/* 'Added Expense Category' Title */}
        <Grid container alignItems="center" justifyContent="center">
          <Typography
            className="paragraph"
            variant="h6"
              // color="textSecondary"
            component="h2"
            marginTop={3}
            marginBottom={3}
          >
            Added Expense Categories
          </Typography>
        </Grid>
        {/* Selected Categories, needs its separate component, as we need to render addBudget
          field independently */}
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={1}
          color="textSecondary"
          marginBottom={5}
        >
          {categoryBudgetList.map((element) => (
            <Grid key={element.id} item className="category-tiles">
              <Card sx={{ minWidth: 300, minHeight: 140 }} elevation={3}>
                <CardHeaderNoPadding
                    // <CardHeader
                  action={(
                    <IconButton onClick={() => handleCategoryDelete(element)}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                    )}
                  title={element.category}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paddingLeft={2}
                  paddingBottom={2}
                >
                  Budget: $
                  {element.budget}
                </Typography>
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item>
                    {/* Every selected category needs its own <ItemrenderSelectedCategories/>
                      component as each category needs its own budget state */}
                    <RenderBudgetInput
                      budgetUpdate={budgetUpdate}
                      categoryName={element.category}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Submit Button */}
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: 70 }}
      >
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleCategoryListSubmit}
        >
          Next
        </Button>
      </Grid>
    </>
  );
};

export default CategoryForm;
