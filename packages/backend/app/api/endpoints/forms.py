from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

from app.services.forms import FormService
from app.core.deps import get_current_user, get_form_service

router = APIRouter()

# Pydantic models for request/response validation
class FormFieldBase(BaseModel):
    type: str
    label: str
    placeholder: Optional[str] = None
    required: bool = False
    options: Optional[List[dict]] = None
    validation: Optional[dict] = None
    defaultValue: Optional[str] = None
    helpText: Optional[str] = None
    disabled: Optional[bool] = None
    className: Optional[str] = None

class FormField(FormFieldBase):
    id: str

class FormBase(BaseModel):
    title: str
    description: str = ""
    fields: List[FormField] = []
    settings: Optional[dict] = None

class FormCreate(FormBase):
    pass

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    fields: Optional[List[FormField]] = None
    published: Optional[bool] = None
    settings: Optional[dict] = None

class Form(FormBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    createdBy: Optional[str] = None
    published: bool = False
    publishedAt: Optional[datetime] = None

    class Config:
        orm_mode = True

class FormSubmissionBase(BaseModel):
    values: dict = Field(..., description="Form field values")

class FormSubmission(FormSubmissionBase):
    id: str
    formId: str
    submittedAt: datetime
    submittedBy: Optional[str] = None

    class Config:
        orm_mode = True

@router.get("/", response_model=List[Form])
async def get_forms(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    form_service: FormService = Depends(get_form_service)
):
    """
    Get all forms for the current user.
    """
    return await form_service.get_forms(user_id=current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=Form, status_code=status.HTTP_201_CREATED)
async def create_form(
    form: FormCreate,
    current_user = Depends(get_current_user),
    form_service: FormService = Depends(get_form_service)
):
    """
    Create a new form.
    """
    return await form_service.create_form(form=form, user_id=current_user.id)

@router.get("/{form_id}", response_model=Form)
async def get_form(
    form_id: str,
    current_user = Depends(get_current_user),
    form_service: FormService = Depends(get_form_service)
):
    """
    Get a specific form by ID.
    """
    form = await form_service.get_form(form_id=form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )
    
    # Check if user has access to this form
    if form.createdBy != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return form

@router.patch("/{form_id}", response_model=Form)
async def update_form(
    form_id: str,
    form_update: FormUpdate,
    current_user = Depends(get_current_user),
    form_service: FormService = Depends(get_form_service)
):
    """
    Update a form.
    """
    # Check if form exists and user has access
    form = await form_service.get_form(form_id=form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )
    
    if form.createdBy != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return await form_service.update_form(form_id=form_id, form_update=form_update)

@router.delete("/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form(
    form_id: str,
    current_user = Depends(get_current_user),
    form_service: FormService = Depends(get_form_service)
):
    """
    Delete a form.
    """
    # Check if form exists and user has access
    form = await form_service.get_form(form_id=form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )
    
    if form.createdBy != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    await form_service.delete_form(form_id=form_id)
    return None

@router.post("/{form_id}/submissions", response_model=FormSubmission)
async def submit_form(
    form_id: str,
    submission: FormSubmissionBase,
    current_user = Depends(get_current_user),
    form_service: FormService = Depends(get_form_service)
):
    """
    Submit a form.
    """
    # Check if form exists
    form = await form_service.get_form(form_id=form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )
    
    # Check if form is published
    if not form.published:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Form is not published"
        )
    
    return await form_service.submit_form(
        form_id=form_id,
        values=submission.values,
        user_id=current_user.id
    )

@router.get("/{form_id}/submissions", response_model=List[FormSubmission])
async def get_form_submissions(
    form_id: str,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    form_service: FormService = Depends(get_form_service)
):
    """
    Get all submissions for a form.
    """
    # Check if form exists and user has access
    form = await form_service.get_form(form_id=form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )
    
    if form.createdBy != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return await form_service.get_form_submissions(
        form_id=form_id,
        skip=skip,
        limit=limit
    )