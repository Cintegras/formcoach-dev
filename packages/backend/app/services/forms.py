from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from app.db.models.form import Form, FormField, FormSubmission
from app.db.session import get_db

class FormService:
    """
    Service for handling form operations
    """
    
    def __init__(self, db=None):
        self.db = db or get_db()
    
    async def get_forms(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Form]:
        """
        Get all forms for a user
        
        Args:
            user_id: ID of the user
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of forms
        """
        query = self.db.query(Form).filter(Form.created_by == user_id)
        return query.offset(skip).limit(limit).all()
    
    async def get_form(self, form_id: str) -> Optional[Form]:
        """
        Get a form by ID
        
        Args:
            form_id: ID of the form
            
        Returns:
            Form if found, None otherwise
        """
        return self.db.query(Form).filter(Form.id == form_id).first()
    
    async def create_form(self, form: Dict[str, Any], user_id: str) -> Form:
        """
        Create a new form
        
        Args:
            form: Form data
            user_id: ID of the user creating the form
            
        Returns:
            Created form
        """
        now = datetime.utcnow()
        
        # Create form
        db_form = Form(
            id=str(uuid.uuid4()),
            title=form.title,
            description=form.description,
            created_by=user_id,
            created_at=now,
            updated_at=now,
            published=False,
            settings=form.settings
        )
        
        # Create form fields
        for field_data in form.fields:
            db_field = FormField(
                id=field_data.id or str(uuid.uuid4()),
                form_id=db_form.id,
                type=field_data.type,
                label=field_data.label,
                placeholder=field_data.placeholder,
                required=field_data.required,
                options=field_data.options,
                validation=field_data.validation,
                default_value=field_data.defaultValue,
                help_text=field_data.helpText,
                disabled=field_data.disabled,
                class_name=field_data.className
            )
            db_form.fields.append(db_field)
        
        self.db.add(db_form)
        self.db.commit()
        self.db.refresh(db_form)
        
        return db_form
    
    async def update_form(self, form_id: str, form_update: Dict[str, Any]) -> Form:
        """
        Update a form
        
        Args:
            form_id: ID of the form to update
            form_update: Updated form data
            
        Returns:
            Updated form
        """
        db_form = await self.get_form(form_id)
        
        # Update form fields
        if form_update.fields is not None:
            # Delete existing fields
            self.db.query(FormField).filter(FormField.form_id == form_id).delete()
            
            # Create new fields
            for field_data in form_update.fields:
                db_field = FormField(
                    id=field_data.id or str(uuid.uuid4()),
                    form_id=db_form.id,
                    type=field_data.type,
                    label=field_data.label,
                    placeholder=field_data.placeholder,
                    required=field_data.required,
                    options=field_data.options,
                    validation=field_data.validation,
                    default_value=field_data.defaultValue,
                    help_text=field_data.helpText,
                    disabled=field_data.disabled,
                    class_name=field_data.className
                )
                db_form.fields.append(db_field)
        
        # Update form metadata
        if form_update.title is not None:
            db_form.title = form_update.title
        
        if form_update.description is not None:
            db_form.description = form_update.description
        
        if form_update.published is not None:
            db_form.published = form_update.published
            if form_update.published and not db_form.published_at:
                db_form.published_at = datetime.utcnow()
        
        if form_update.settings is not None:
            db_form.settings = form_update.settings
        
        db_form.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(db_form)
        
        return db_form
    
    async def delete_form(self, form_id: str) -> None:
        """
        Delete a form
        
        Args:
            form_id: ID of the form to delete
        """
        # Delete form fields
        self.db.query(FormField).filter(FormField.form_id == form_id).delete()
        
        # Delete form submissions
        self.db.query(FormSubmission).filter(FormSubmission.form_id == form_id).delete()
        
        # Delete form
        self.db.query(Form).filter(Form.id == form_id).delete()
        
        self.db.commit()
    
    async def submit_form(self, form_id: str, values: Dict[str, Any], user_id: Optional[str] = None) -> FormSubmission:
        """
        Submit a form
        
        Args:
            form_id: ID of the form to submit
            values: Form field values
            user_id: ID of the user submitting the form (optional)
            
        Returns:
            Form submission
        """
        # Create submission
        submission = FormSubmission(
            id=str(uuid.uuid4()),
            form_id=form_id,
            submitted_at=datetime.utcnow(),
            submitted_by=user_id,
            values=values
        )
        
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)
        
        return submission
    
    async def get_form_submissions(self, form_id: str, skip: int = 0, limit: int = 100) -> List[FormSubmission]:
        """
        Get all submissions for a form
        
        Args:
            form_id: ID of the form
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of form submissions
        """
        query = self.db.query(FormSubmission).filter(FormSubmission.form_id == form_id)
        return query.order_by(FormSubmission.submitted_at.desc()).offset(skip).limit(limit).all()

def get_form_service(db=None) -> FormService:
    """
    Get an instance of the form service
    
    Args:
        db: Database session (optional)
        
    Returns:
        Form service instance
    """
    return FormService(db)